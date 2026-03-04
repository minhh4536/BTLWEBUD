const db = require("../common/db");

async function getAllShowtimes() {
  const [rows] = await db.query("SELECT * FROM showtimes");
  return rows;
}

async function getShowtimeById(id) {
  const [rows] = await db.query("SELECT * FROM showtimes WHERE id = ?", [id]);
  return rows[0];
}

async function getShowtimesByMovieId(movie_id) {
  const [rows] = await db.query("SELECT * FROM showtimes WHERE movie_id = ?", [
    movie_id,
  ]);
  return rows;
}

async function getShowtimesByShowDateAndMovie(show_date, movie_id) {
  const [rows] = await db.query(
    "SELECT * FROM showtimes WHERE show_date = ? AND movie_id = ?",
    [show_date, movie_id],
  );
  return rows;
}

async function checkTimeConflict(room_id, show_date, start_time, end_time) {
  const [rows] = await db.query(
    `SELECT * FROM showtimes
     WHERE room_id = ?
     AND show_date = ?
     AND start_time < ?
     AND end_time > ?`,
    [room_id, show_date, end_time, start_time],
  );

  return rows.length > 0;
}

async function createShowtime(
  movie_id,
  room_id,
  show_date,
  start_time,
  end_time,
  format,
  price,
) {
  const [result] = await db.query(
    "INSERT INTO showtimes (movie_id, room_id, show_date, start_time, end_time, format, price) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [movie_id, room_id, show_date, start_time, end_time, format, price],
  );
  return result;
}

async function updateShowtime(
  id,
  movie_id,
  room_id,
  show_date,
  start_time,
  end_time,
  format,
  price,
) {
  const [result] = await db.query(
    "UPDATE showtimes SET movie_id = ?, room_id = ?, show_date = ?, start_time = ?, end_time = ?, format = ?, price = ? WHERE id = ?",
    [movie_id, room_id, show_date, start_time, end_time, format, price, id],
  );
  return result;
}

async function deleteShowtime(id) {
  const [result] = await db.query("DELETE FROM showtimes WHERE id = ?", [id]);
  return result;
}

module.exports = {
  getAllShowtimes,
  getShowtimeById,
  getShowtimesByMovieId,
  getShowtimesByShowDateAndMovie,
  checkTimeConflict,
  createShowtime,
  updateShowtime,
  deleteShowtime,
};
