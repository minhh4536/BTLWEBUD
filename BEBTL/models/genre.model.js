const db = require("../common/db");

async function createGenre(genre_name) {
  const [result] = await db.execute(
    "INSERT INTO genres (genre_name) VALUES (?)",
    [genre_name],
  );
  return result;
}

async function getAllGenres() {
  const [rows] = await db.execute("SELECT * FROM genres");
  return rows;
}

async function getGenreById(id) {
  const [rows] = await db.execute("SELECT * FROM genres WHERE id = ?", [id]);
  return rows[0];
}

async function getGenreByName(genre_name) {
  const [rows] = await db.execute(
    "SELECT * FROM genres WHERE genre_name LIKE ?",
    [`%${genre_name}%`],
  );
  return rows;
}

async function updateGenre(id, genre_name) {
  const [result] = await db.execute(
    "UPDATE genres SET genre_name = ? WHERE id = ?",
    [genre_name, id],
  );
  return result;
}

async function deleteGenre(id) {
  const [result] = await db.execute("DELETE FROM genres WHERE id = ?", [id]);
  return result;
}

module.exports = {
  createGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
  getGenreByName,
};
