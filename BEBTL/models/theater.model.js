const db = require("../common/db");

async function getAllTheater() {
  const [results] = await db.query("SELECT * FROM theater");
  return results;
}

async function getTheaterById(id) {
  const [results] = await db.query("SELECT * FROM theater WHERE id = ?", [id]);
  return results;
}

async function getTheaterByName(name) {
  const [results] = await db.query("SELECT * FROM theater WHERE name LIKE ?", [
    `%${name}%`,
  ]);
  return results;
}

async function createTheater(name, address, phone) {
  const [result] = await db.query(
    "INSERT INTO theater (name, address, phone) VALUES (?, ?, ?)",
    [name, address, phone],
  );
  return result;
}

async function updateTheater(id, name, address, phone) {
  const [result] = await db.query(
    "UPDATE theater SET name = ?, address = ?, phone = ? WHERE id = ?",
    [name, address, phone, id],
  );
  return result;
}

async function deleteTheater(id) {
  const [result] = await db.query("DELETE FROM theater WHERE id = ?", [id]);
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
