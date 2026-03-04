const db = require("../common/db");

async function getAllRooms() {
  const [results] = await db.query("SELECT * FROM rooms");
  return results;
}

async function getRoomById(id) {
  const [results] = await db.query("SELECT * FROM rooms WHERE id = ?", [id]);
  return results;
}

async function getRoomsByTheaterId(theater_id) {
  const [results] = await db.query("SELECT * FROM rooms WHERE theater_id = ?", [
    theater_id,
  ]);
  return results;
}

async function createRoom(theater_id, name, capacity) {
  const [result] = await db.query(
    "INSERT INTO rooms (theater_id, name, capacity) VALUES (?, ?, ?)",
    [theater_id, name, capacity],
  );
  return result;
}

async function updateRoom(id, theater_id, name, capacity) {
  const [result] = await db.query(
    "UPDATE rooms SET theater_id = ?, name = ?, capacity = ? WHERE id = ?",
    [theater_id, name, capacity, id],
  );
  return result;
}

async function deleteRoom(id) {
  const [result] = await db.query("DELETE FROM rooms WHERE id = ?", [id]);
  return result;
}

module.exports = {
  getAllRooms,
  getRoomById,
  getRoomsByTheaterId,
  createRoom,
  updateRoom,
  deleteRoom,
};
