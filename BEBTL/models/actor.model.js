const db = require("../common/db");

const actorModel = {
  // Lấy tất cả diễn viên
  getAllActors: async () => {
    const [rows] = await db.query("SELECT * FROM Actors ORDER BY name ASC");
    return rows;
  },

  // Lấy theo ID
  getActorById: async (actor_id) => {
    const [rows] = await db.query("SELECT * FROM Actors WHERE actor_id = ?", [
      actor_id,
    ]);
    return rows[0];
  },

  // Tìm theo tên (search)
  getActorByName: async (name) => {
    const [rows] = await db.query(
      "SELECT * FROM Actors WHERE name LIKE ? ORDER BY name ASC",
      [`%${name}%`],
    );
    return rows;
  },

  // Thêm mới diễn viên
  createActor: async (name, avatar = null) => {
    const [result] = await db.query(
      "INSERT INTO Actors (name, avatar) VALUES (?, ?)",
      [name, avatar],
    );
    return result;
  },

  // Cập nhật diễn viên
  updateActor: async (actor_id, name, avatar = null) => {
    const [result] = await db.query(
      "UPDATE Actors SET name = ?, avatar = ? WHERE actor_id = ?",
      [name, avatar, actor_id],
    );
    return result;
  },

  // Xóa diễn viên
  deleteActor: async (actor_id) => {
    const [result] = await db.query("DELETE FROM Actors WHERE actor_id = ?", [
      actor_id,
    ]);
    return result;
  },
};

module.exports = actorModel;
