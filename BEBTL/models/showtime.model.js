const db = require("../common/db");

const showtimeModel = {
  // ==================== CREATE SHOWTIME ====================
  createShowtime: async (
    movie_id,
    room_id,
    show_date,
    start_time,
    end_time,
    format,
    base_price,
  ) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [conflicts] = await connection.query(
        `
        SELECT showtime_id
        FROM Showtimes
        WHERE room_id = ?
          AND show_date = ?
          AND (
            (start_time < ? AND end_time > ?)
            OR (start_time < ? AND end_time > ?)
            OR (start_time >= ? AND end_time <= ?)
          )
      `,
        [
          room_id,
          show_date,
          end_time,
          end_time,
          start_time,
          start_time,
          start_time,
          end_time,
        ],
      );

      if (conflicts.length > 0) {
        throw new Error(
          "Thời gian suất chiếu bị trùng với suất khác trong cùng phòng. Vui lòng chọn khung giờ khác.",
        );
      }

      const [result] = await connection.query(
        `INSERT INTO Showtimes (movie_id, room_id, show_date, start_time, end_time, format, price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          movie_id,
          room_id,
          show_date,
          start_time,
          end_time,
          format || "2D",
          base_price,
        ],
      );

      const showtime_id = result.insertId;

      // Gọi Procedure tạo Tickets
      await connection.query("CALL GenerateTickets(?)", [showtime_id]);

      await connection.commit();
      return { showtime_id };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // ==================== GET ALL SHOWTIMES ====================
  getAllShowtimes: async () => {
    const [rows] = await db.query(`
      SELECT 
        sh.showtime_id,
        sh.show_date,
        sh.start_time,
        sh.end_time,
        sh.format,
        sh.price AS base_price,
        m.title AS movie_title,
        r.room_name,
        th.name AS theater_name,
        COUNT(CASE WHEN tk.status = 'sold' THEN 1 END) AS tickets_sold
      FROM Showtimes sh
      JOIN Movies m ON sh.movie_id = m.movie_id
      JOIN Rooms r ON sh.room_id = r.room_id
      JOIN Theaters th ON r.theater_id = th.theater_id
      LEFT JOIN Tickets tk ON sh.showtime_id = tk.showtime_id
      GROUP BY sh.showtime_id
      ORDER BY sh.show_date DESC, sh.start_time ASC
    `);
    return rows;
  },

  getCurrentlyShowing: async () => {
    const [rows] = await db.query(`
      SELECT 
        sh.showtime_id,
        sh.show_date,
        sh.start_time,
        sh.end_time,
        sh.format,
        sh.price AS base_price,
        m.title AS movie_title,
        r.room_name,
        th.name AS theater_name
      FROM Showtimes sh
      JOIN Movies m ON sh.movie_id = m.movie_id
      JOIN Rooms r ON sh.room_id = r.room_id
      JOIN Theaters th ON r.theater_id = th.theater_id
      WHERE sh.show_date = CURDATE()
        AND sh.end_time >= CURTIME()
      ORDER BY sh.start_time ASC
    `);
    return rows;
  },

  getUpcoming: async () => {
    const [rows] = await db.query(`
      SELECT DISTINCT
        m.movie_id,
        m.title AS movie_title,
        m.poster,
        m.description,
        m.release_date,
        MIN(sh.show_date) AS next_show_date,
        MIN(sh.start_time) AS next_start_time
      FROM Showtimes sh
      JOIN Movies m ON sh.movie_id = m.movie_id
      WHERE sh.show_date > CURDATE()
      GROUP BY m.movie_id, m.title, m.poster, m.description, m.release_date
      ORDER BY next_show_date ASC, next_start_time ASC
    `);
    return rows;
  },

  getTopBookedCurrentMovies: async () => {
    const [rows] = await db.query(`
      SELECT 
        m.movie_id,
        m.title AS movie_title,
        COUNT(bd.booking_detail_id) AS total_tickets_sold
      FROM BookingDetails bd
      JOIN Tickets t ON bd.ticket_id = t.ticket_id
      JOIN Bookings b ON bd.booking_id = b.booking_id
      JOIN Showtimes sh ON t.showtime_id = sh.showtime_id
      JOIN Movies m ON sh.movie_id = m.movie_id
      WHERE b.booking_status = 'paid'
        AND sh.show_date = CURDATE()
      GROUP BY m.movie_id, m.title
      ORDER BY total_tickets_sold DESC
      LIMIT 10
    `);
    return rows;
  },

  // ==================== GET SHOWTIME BY ID + SƠ ĐỒ GHẾ ====================
  getShowtimeById: async (showtime_id) => {
    const [showtime] = await db.query(
      `
      SELECT 
        sh.*,
        m.title AS movie_title,
        r.room_name,
        t.name AS theater_name
      FROM Showtimes sh
      JOIN Movies m ON sh.movie_id = m.movie_id
      JOIN Rooms r ON sh.room_id = r.room_id
      JOIN Theaters t ON r.theater_id = t.theater_id
      WHERE sh.showtime_id = ?
    `,
      [showtime_id],
    );

    if (!showtime[0]) return null;

    const [seats] = await db.query(
      `
      SELECT 
        t.ticket_id,
        s.seat_number,
        s.status AS seat_status,
        st.name AS seat_type_name,
        st.surcharge,
        t.price,
        t.status AS ticket_status
      FROM Tickets t
      JOIN Seats s ON t.seat_id = s.seat_id
      JOIN SeatTypes st ON s.seat_type_id = st.seat_type_id
      WHERE t.showtime_id = ?
      ORDER BY s.seat_number
    `,
      [showtime_id],
    );

    return {
      ...showtime[0],
      seats: seats,
    };
  },

  // ==================== UPDATE SHOWTIME ====================
  updateShowtime: async (
    showtime_id,
    movie_id,
    room_id,
    show_date,
    start_time,
    end_time,
    format,
    base_price,
  ) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Kiểm tra xem suất chiếu có vé đã bán không
      const [check] = await connection.query(
        `
        SELECT COUNT(*) as soldCount 
        FROM Tickets 
        WHERE showtime_id = ? AND status = 'sold'
      `,
        [showtime_id],
      );

      if (check[0].soldCount > 0) {
        throw new Error("Không thể sửa suất chiếu đã có vé được bán.");
      }

      // Cập nhật thông tin Showtime
      const [result] = await connection.query(
        `UPDATE Showtimes 
         SET movie_id = ?, room_id = ?, show_date = ?, start_time = ?, 
             end_time = ?, format = ?, price = ?
         WHERE showtime_id = ?`,
        [
          movie_id,
          room_id,
          show_date,
          start_time,
          end_time,
          format || "2D",
          base_price,
          showtime_id,
        ],
      );

      if (result.affectedRows === 0) {
        throw new Error("Showtime not found");
      }

      await connection.commit();
      return { message: "Showtime updated successfully" };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // ==================== DELETE SHOWTIME ====================
  deleteShowtime: async (showtime_id) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [check] = await connection.query(
        `
        SELECT COUNT(*) as bookedCount 
        FROM Tickets 
        WHERE showtime_id = ? 
        AND status IN ('sold', 'reserved')
      `,
        [showtime_id],
      );

      if (check[0].bookedCount > 0) {
        throw new Error(
          "Không thể xóa suất chiếu đã có khách đặt vé. Vui lòng xử lý hoàn tiền trước.",
        );
      }

      await connection.query("DELETE FROM Tickets WHERE showtime_id = ?", [
        showtime_id,
      ]);
      await connection.query("DELETE FROM Showtimes WHERE showtime_id = ?", [
        showtime_id,
      ]);

      await connection.commit();
      return { message: "Showtime deleted successfully" };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = showtimeModel;
