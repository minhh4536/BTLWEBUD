const db = require("../common/db");

async function getAllSeats() {
  const [results] = await db.query("SELECT * FROM seats");
  return results;
}

async function getSeatById(id) {
  const [results] = await db.query("SELECT * FROM seats WHERE seat_id = ?", [
    id,
  ]);
  return results;
}

async function getSeatsByRoomId(room_id) {
  const [results] = await db.query("SELECT * FROM seats WHERE room_id = ?", [
    room_id,
  ]);
  return results;
}

async function getSeatsByBookingId(booking_id) {
  const [results] = await db.query(
    `
    SELECT s.*
    FROM Seats s
    JOIN Tickets t ON s.seat_id = t.seat_id
    JOIN BookingDetails bd ON bd.ticket_id = t.ticket_id
    WHERE bd.booking_id = ?
    `,
    [booking_id],
  );
  return results;
}

async function getALLSeatsByShowtimeId(showtime_id) {
  const [results] = await db.query(
    `
    SELECT 
      s.seat_id,
      s.seat_number,
      s.seat_type_id,
      s.status AS seat_status,
      t.ticket_id,
      t.price,
      t.status AS ticket_status
    FROM Seats s
    JOIN Showtimes sh ON sh.room_id = s.room_id
    LEFT JOIN Tickets t ON t.seat_id = s.seat_id AND t.showtime_id = sh.showtime_id
    WHERE sh.showtime_id = ?
    ORDER BY s.seat_number
    `,
    [showtime_id],
  );
  return results;
}

async function getSeatsBySeatType(seat_type_id) {
  const [results] = await db.query(
    "SELECT * FROM Seats WHERE seat_type_id = ?",
    [seat_type_id],
  );
  return results;
}

async function createSeat(seat_number, room_id, seat_type_id) {
  const [result] = await db.query(
    "INSERT INTO Seats (room_id, seat_number, seat_type_id) VALUES (?, ?, ?)",
    [room_id, seat_number, seat_type_id],
  );
  return result;
}

async function updateSeat(id, room_id, seat_number, seat_type_id) {
  const [result] = await db.query(
    "UPDATE Seats SET room_id = ?, seat_number = ?, seat_type_id = ? WHERE seat_id = ?",
    [room_id, seat_number, seat_type_id, id],
  );
  return result;
}

async function deleteSeat(id) {
  const [result] = await db.query("DELETE FROM seats WHERE seat_id = ?", [id]);
  return result;
}

async function getseatsavailablebyshowtimeid(showtime_id) {
  const [results] = await db.query(
    `
    SELECT s.seat_id, s.seat_number, s.seat_type_id
    FROM Seats s
    JOIN Tickets t ON t.seat_id = s.seat_id
    WHERE t.showtime_id = ? AND t.status = 'available'
    ORDER BY s.seat_number
    `,
    [showtime_id],
  );
  return results;
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
  getseatsavailablebyshowtimeid,
};
