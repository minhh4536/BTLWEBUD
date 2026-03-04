const db = require("../common/db");

async function getAllBookings() {
  const [results] = await db.query("SELECT * FROM bookings");
  return results;
}

async function getBookingById(id) {
  const [results] = await db.query("SELECT * FROM bookings WHERE id = ?", [id]);
  return results;
}

async function createBooking(user_id, booking_code, showtime_id, total_amount) {
  const [result] = await db.query(
    "INSERT INTO bookings (user_id, booking_code, showtime_id, total_amount) VALUES (?, ?, ?, ?)",
    [user_id, booking_code, showtime_id, total_amount],
  );
  return result;
}

async function updateBooking(
  id,
  user_id,
  booking_code,
  showtime_id,
  total_amount,
  booking_status,
) {
  const [result] = await db.query(
    "UPDATE bookings SET user_id = ?, booking_code = ?, showtime_id = ?, total_amount = ?, booking_status = ? WHERE id = ?",
    [user_id, booking_code, showtime_id, total_amount, booking_status, id],
  );
  return result;
}

async function deleteBooking(id) {
  const [result] = await db.query("DELETE FROM bookings WHERE id = ?", [id]);
  return result;
}

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
