const db = require("../common/db");

async function getAllBookingDetails() {
  const [results] = await db.query("SELECT * FROM BookingDetails");
  return results;
}

async function getBookingDetailById(id) {
  const [results] = await db.query(
    "SELECT * FROM BookingDetails WHERE id = ?",
    [id],
  );
  return results;
}

async function getBookingDetailsByBookingId(booking_id) {
  const [results] = await db.query(
    "SELECT * FROM BookingDetails WHERE booking_id = ?",
    [booking_id],
  );
  return results;
}

async function createBookingDetail(booking_id, seat_id, showtime_id) {
  const [result] = await db.query(
    "INSERT INTO BookingDetails (booking_id,seat_id, showtime_id ) VALUES (?, ?, ?)",
    [booking_id, seat_id, showtime_id],
  );
  return result;
}

async function deleteBookingDetail(id) {
  const [result] = await db.query("DELETE FROM BookingDetails WHERE id = ?", [
    id,
  ]);
  return result;
}

module.exports = {
  getAllBookingDetails,
  getBookingDetailById,
  getBookingDetailsByBookingId,
  createBookingDetail,
  deleteBookingDetail,
};
