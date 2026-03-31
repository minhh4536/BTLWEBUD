const db = require("../common/db");

const genreModel = {
  getAllGenres: async () => {
    const [rows] = await db.query("SELECT * FROM Genres ORDER BY genre_name");
    return rows;
  },

  getGenreById: async (genre_id) => {
    const [rows] = await db.query("SELECT * FROM Genres WHERE genre_id = ?", [
      genre_id,
    ]);
    return rows[0];
  },

  getGenreByName: async (genre_name) => {
    const [rows] = await db.query("SELECT * FROM Genres WHERE genre_name = ?", [
      genre_name,
    ]);
    return rows[0];
  },

  createGenre: async (genre_name) => {
    const [result] = await db.query(
      "INSERT INTO Genres (genre_name) VALUES (?)",
      [genre_name],
    );
    return result;
  },

  updateGenre: async (genre_id, genre_name) => {
    const [result] = await db.query(
      "UPDATE Genres SET genre_name = ? WHERE genre_id = ?",
      [genre_name, genre_id],
    );
    return result;
  },

  deleteGenre: async (genre_id) => {
    const [result] = await db.query("DELETE FROM Genres WHERE genre_id = ?", [
      genre_id,
    ]);
    return result;
  },
};

module.exports = genreModel;
