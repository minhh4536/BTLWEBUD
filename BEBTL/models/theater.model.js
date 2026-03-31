const db = require("../common/db");

async function getAllTheater() {
  const [results] = await db.query("SELECT * FROM theaters");
  return results;
}

async function getTheaterById(id) {
  const [results] = await db.query(
    "SELECT * FROM theaters WHERE theater_id = ?",
    [id],
  );
  return results;
}

async function getTheaterByName(name) {
  const [results] = await db.query("SELECT * FROM theaters WHERE name LIKE ?", [
    `%${name}%`,
  ]);
  return results;
}

async function createTheater(name, address, phone) {
  const [result] = await db.query(
    "INSERT INTO theaters (name, address, phone) VALUES (?, ?, ?)",
    [name, address, phone],
  );
  return result;
}

async function updateTheater(id, name, address, phone) {
  const [result] = await db.query(
    "UPDATE theaters SET name = ?, address = ?, phone = ? WHERE theater_id = ?",
    [name, address, phone, id],
  );
  return result;
}

async function deleteTheater(id) {
  const [result] = await db.query("DELETE FROM theaters WHERE theater_id = ?", [
    id,
  ]);
  return result;
}

module.exports = {
  getAllTheater,
  getTheaterById,
  getTheaterByName,
  createTheater,
  updateTheater,
  deleteTheater,
};
