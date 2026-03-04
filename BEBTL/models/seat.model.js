const db = require("../common/db");

async function getAllSeats() {
  const [results] = await db.query("SELECT * FROM seats");
  return results;
}

async function getSeatById(id) {
  const [results] = await db.query("SELECT * FROM seats WHERE id = ?", [id]);
  return results;
}

async function getSeatsByRoomId(room_id) {
  const [results] = await db.query("SELECT * FROM seats WHERE room_id = ?", [
    room_id,
  ]);
  return results;
}

async function getSeatsByBookingId(booking_id) {
  const [results] = await db.query("SELECT * FROM seats WHERE booking_id = ?", [
    booking_id,
  ]);
  return results;
}

async function getALLSeatsByShowtimeId(showtime_id) {
  const [results] = await db.query(
    "SELECT s.seat_number from seats s join BookingDetails b on s.seat_id = b.seat_id join Showtimes st on st.showtime_id = b.showtime_id where st.showtime_id = ? ",
    [showtime_id],
  );
  return results;
}

async function getSeatsBySeatType(seat_type) {
  const [results] = await db.query("SELECT * FROM seats WHERE seat_type = ?", [
    seat_type,
  ]);
  return results;
}

async function createSeat(room_id, seat_number, seat_type) {
  const [result] = await db.query(
    "INSERT INTO seats (room_id, seat_number, seat_type) VALUES (?, ?, ?)",
    [room_id, seat_number, seat_type],
  );
  return result;
}

async function updateSeat(id, room_id, seat_number, seat_type) {
  const [result] = await db.query(
    "UPDATE seats SET room_id = ?, seat_number = ?, seat_type = ? WHERE id = ?",
    [room_id, seat_number, seat_type, id],
  );
  return result;
}

async function deleteSeat(id) {
  const [result] = await db.query("DELETE FROM seats WHERE id = ?", [id]);
  return result;
}

module.exports = {
  getAllSeats,
  getSeatById,
  getSeatsByRoomId,
  getSeatsBySeatType,
  createSeat,
  updateSeat,
  deleteSeat,
  getSeatsByBookingId,
  getALLSeatsByShowtimeId,
};
