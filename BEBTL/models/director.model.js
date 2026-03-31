const db = require("../common/db");

const directorModel = {
  // Lấy tất cả đạo diễn
  getAllDirectors: async () => {
    const [rows] = await db.query("SELECT * FROM Directors ORDER BY name ASC");
    return rows;
  },

  // Lấy theo ID
  getDirectorById: async (director_id) => {
    const [rows] = await db.query(
      "SELECT * FROM Directors WHERE director_id = ?",
      [director_id],
    );
    return rows[0];
  },

  // Tìm theo tên (search)
  getDirectorByName: async (name) => {
    const [rows] = await db.query(
      "SELECT * FROM Directors WHERE name LIKE ? ORDER BY name ASC",
      [`%${name}%`],
    );
    return rows;
  },

  // Thêm mới đạo diễn
  createDirector: async (name) => {
    const [result] = await db.query("INSERT INTO Directors (name) VALUES (?)", [
      name,
    ]);
    return result;
  },

  // Cập nhật đạo diễn
  updateDirector: async (director_id, name) => {
    const [result] = await db.query(
      "UPDATE Directors SET name = ? WHERE director_id = ?",
      [name, director_id],
    );
    return result;
  },

  // Xóa đạo diễn
  deleteDirector: async (director_id) => {
    const [result] = await db.query(
      "DELETE FROM Directors WHERE director_id = ?",
      [director_id],
    );
    return result;
  },
};

module.exports = directorModel;
