const db = require("../common/db");

const roomModel = {
  // ==================== CREATE ROOM + AUTO GENERATE SEATS ====================
  createRoom: async (theater_id, room_name, num_rows, num_cols) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Tạo Room
      const [roomResult] = await connection.query(
        "INSERT INTO Rooms (theater_id, room_name, total_seats) VALUES (?, ?, ?)",
        [theater_id, room_name, num_rows * num_cols],
      );

      const room_id = roomResult.insertId;

      // 2. Tạo Seats tự động
      const seats = [];
      for (let row = 0; row < num_rows; row++) {
        const rowLetter = String.fromCharCode(65 + row); // A, B, C, ..., J...

        let seat_type_id = 1; // Normal
        if (row >= 4 && row <= 7)
          seat_type_id = 2; // E-H → VIP
        else if (row >= 8) seat_type_id = 3; // I+ → Couple

        for (let col = 1; col <= num_cols; col++) {
          const seat_number = `${rowLetter}${col}`;
          seats.push([room_id, seat_number, seat_type_id, "active"]); // status mặc định = active
        }
      }

      await connection.query(
        "INSERT INTO Seats (room_id, seat_number, seat_type_id, status) VALUES ?",
        [seats],
      );

      await connection.commit();

      return {
        room_id,
        room_name,
        total_seats: num_rows * num_cols,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // ==================== GET ALL ROOMS ====================
  getAllRooms: async () => {
    const [rows] = await db.query(`
      SELECT 
        r.room_id,
        r.room_name,
        r.total_seats,
        t.name as theater_name,
        COUNT(s.seat_id) as current_seat_count
      FROM Rooms r
      JOIN Theaters t ON r.theater_id = t.theater_id
      LEFT JOIN Seats s ON r.room_id = s.room_id
      GROUP BY r.room_id
      ORDER BY t.name, r.room_name
    `);
    return rows;
  },

  // ==================== GET ROOM BY ID + SEAT LAYOUT ====================
  getRoomById: async (room_id) => {
    const [room] = await db.query(
      `
      SELECT r.*, t.name as theater_name 
      FROM Rooms r 
      JOIN Theaters t ON r.theater_id = t.theater_id 
      WHERE r.room_id = ?
    `,
      [room_id],
    );

    if (!room[0]) return null;

    const [seats] = await db.query(
      `
      SELECT 
        s.seat_id, 
        s.seat_number, 
        s.seat_type_id,
        s.status,
        st.name as seat_type_name, 
        st.surcharge 
      FROM Seats s
      JOIN SeatTypes st ON s.seat_type_id = st.seat_type_id
      WHERE s.room_id = ?
      ORDER BY s.seat_number
    `,
      [room_id],
    );

    return {
      ...room[0],
      seats: seats,
    };
  },

  // ==================== UPDATE ROOM ====================
  updateRoom: async (room_id, room_name) => {
    const [result] = await db.query(
      "UPDATE Rooms SET room_name = ? WHERE room_id = ?",
      [room_name, room_id],
    );
    return result;
  },

  // ==================== DELETE ROOM ====================
  deleteRoom: async (room_id) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Xóa tất cả ghế trước
      await connection.query("DELETE FROM Seats WHERE room_id = ?", [room_id]);

      // Xóa Room
      const [result] = await connection.query(
        "DELETE FROM Rooms WHERE room_id = ?",
        [room_id],
      );

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = roomModel;
