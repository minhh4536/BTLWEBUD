const db = require("../common/db");

const seatTypeModel = {
  // Lấy tất cả loại ghế
  getAllSeatTypes: async () => {
    const [rows] = await db.query("SELECT * FROM SeatTypes ORDER BY name ASC");
    return rows;
  },

  // Lấy theo ID
  getSeatTypeById: async (seat_type_id) => {
    const [rows] = await db.query(
      "SELECT * FROM SeatTypes WHERE seat_type_id = ?",
      [seat_type_id],
    );
    return rows[0];
  },

  // Tìm theo tên
  getSeatTypeByName: async (name) => {
    const [rows] = await db.query(
      "SELECT * FROM SeatTypes WHERE name LIKE ? ORDER BY name ASC",
      [`%${name}%`],
    );
    return rows;
  },

  // Thêm mới loại ghế
  createSeatType: async (name, surcharge = 0) => {
    const [result] = await db.query(
      "INSERT INTO SeatTypes (name, surcharge) VALUES (?, ?)",
      [name, surcharge],
    );
    return result;
  },

  // Cập nhật loại ghế
  updateSeatType: async (seat_type_id, name, surcharge) => {
    const [result] = await db.query(
      "UPDATE SeatTypes SET name = ?, surcharge = ? WHERE seat_type_id = ?",
      [name, surcharge, seat_type_id],
    );
    return result;
  },

  // Xóa loại ghế
  deleteSeatType: async (seat_type_id) => {
    const [result] = await db.query(
      "DELETE FROM SeatTypes WHERE seat_type_id = ?",
      [seat_type_id],
    );
    return result;
  },
};

module.exports = seatTypeModel;
