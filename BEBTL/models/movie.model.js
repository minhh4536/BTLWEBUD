const db = require("../common/db");

async function createMovie(
  title,
  description,
  duration,
  release_date,
  country,
  director,
  actors,
  poster,
  trailerURL,
  genre_id,
) {
  const [result] = await db.execute(
    "INSERT INTO movies (title, description,duration, release_date, country, director, actors, poster, trailer_url, genre_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      description,
      duration,
      release_date,
      country,
      director,
      actors,
      poster,
      trailerURL,
      genre_id,
    ],
  );
  return result;
}

async function getAllMovies() {
  const [rows] = await db.execute("SELECT * FROM movies");
  return rows;
}

async function getMovieById(id) {
  const [rows] = await db.execute("SELECT * FROM movies WHERE id = ?", [id]);
  return rows[0];
}

async function getMoviesByTitle(title) {
  const [rows] = await db.execute("SELECT * FROM movies WHERE title LIKE ?", [
    `%${title}%`,
  ]);
  return rows;
}

async function updateMovie(
  id,
  title,
  description,
  duration,
  release_date,
  country,
  director,
  actors,
  poster,
  trailerURL,
  genre_id,
) {
  const [result] = await db.execute(
    "UPDATE movies SET title = ?, description = ?, duration = ?, release_date = ?, country = ?, director = ?, actors = ?, poster = ?, trailer_url = ?, genre_id = ? WHERE id = ?",
    [
      title,
      description,
      duration,
      release_date,
      country,
      director,
      actors,
      poster,
      trailerURL,
      genre_id,
      id,
    ],
  );
  return result;
}

async function deleteMovie(id) {
  const [result] = await db.execute("DELETE FROM movies WHERE id = ?", [id]);
  return result;
}

async function getMoviesByGenre(genre_id) {
  const [rows] = await db.execute("SELECT * FROM movies WHERE genre_id = ?", [
    genre_id,
  ]);
  return rows;
}

async function getMoviesByDirector(director) {
  const [rows] = await db.execute(
    "SELECT * FROM movies WHERE director LIKE ?",
    [`%${director}%`],
  );
  return rows;
}

async function getMoviesByActor(actor) {
  const [rows] = await db.execute("SELECT * FROM movies WHERE actors LIKE ?", [
    `%${actor}%`,
  ]);
  return rows;
}

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  getMoviesByTitle,
  updateMovie,
};
