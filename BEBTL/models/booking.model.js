const db = require("../common/db");

const bookingModel = {
  createBooking: async (
    user_id,
    showtime_id,
    ticket_ids,
    payment_method = "cash",
  ) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Kiểm tra các ticket_ids có tồn tại và thuộc showtime này không
      const [tickets] = await connection.query(
        `
        SELECT ticket_id, price, status 
        FROM Tickets 
        WHERE ticket_id IN (?) AND showtime_id = ?`,
        [ticket_ids, showtime_id],
      );

      if (tickets.length !== ticket_ids.length) {
        throw new Error(
          "Một số vé không tồn tại hoặc không thuộc suất chiếu này",
        );
      }

      // Kiểm tra vé còn available không
      const unavailable = tickets.filter((t) => t.status !== "available");
      if (unavailable.length > 0) {
        throw new Error("Một số vé đã được đặt hoặc bán");
      }

      // 2. Tính tổng tiền
      const total_amount = tickets.reduce(
        (sum, t) => sum + parseFloat(t.price),
        0,
      );

      // 3. Tạo Booking
      const booking_code = "BK" + Date.now().toString().slice(-8);
      const [bookingResult] = await connection.query(
        `INSERT INTO Bookings (user_id, booking_code, showtime_id, total_amount, booking_status)
         VALUES (?, ?, ?, ?, 'pending')`,
        [user_id, booking_code, showtime_id, total_amount],
      );

      const booking_id = bookingResult.insertId;

      // 4. Tạo BookingDetails (CHỈ lưu ticket_id)
      const bookingDetailValues = ticket_ids.map((ticket_id) => [
        booking_id,
        ticket_id,
      ]);
      await connection.query(
        `INSERT INTO BookingDetails (booking_id, ticket_id) VALUES ?`,
        [bookingDetailValues],
      );

      // 5. Tạo Payment
      await connection.query(
        `INSERT INTO Payments (booking_id, payment_method, payment_status)
         VALUES (?, ?, 'pending')`,
        [booking_id, payment_method],
      );

      // 6. Cập nhật trạng thái vé thành 'sold'
      await connection.query(
        `UPDATE Tickets SET status = 'sold' WHERE ticket_id IN (?)`,
        [ticket_ids],
      );

      await connection.commit();

      return {
        booking_id,
        booking_code,
        total_amount,
        ticket_count: ticket_ids.length,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get booking với chi tiết vé
  getBookingWithDetails: async (booking_id) => {
    const [booking] = await db.query(
      `
      SELECT b.*, u.username, sh.show_date, sh.start_time, m.title as movie_title
      FROM Bookings b
      JOIN Users u ON b.user_id = u.user_id
      JOIN Showtimes sh ON b.showtime_id = sh.showtime_id
      JOIN Movies m ON sh.movie_id = m.movie_id
      WHERE b.booking_id = ?
    `,
      [booking_id],
    );

    if (!booking[0]) return null;

    const [details] = await db.query(
      `
      SELECT 
        bd.booking_detail_id,
        t.ticket_id,
        s.seat_number,
        st.name as seat_type_name,
        t.price,
        t.status
      FROM BookingDetails bd
      JOIN Tickets t ON bd.ticket_id = t.ticket_id
      JOIN Seats s ON t.seat_id = s.seat_id
      JOIN SeatTypes st ON s.seat_type_id = st.seat_type_id
      WHERE bd.booking_id = ?
    `,
      [booking_id],
    );

    return {
      ...booking[0],
      details,
    };
  },
};

module.exports = bookingModel;
