const db = require("../common/db");

async function getAllBookingDetails() {
  const [results] = await db.query("SELECT * FROM BookingDetails");
  return results;
}

async function getBookingDetailById(id) {
  const [results] = await db.query(
    "SELECT * FROM BookingDetails WHERE booking_detail_id = ?",
    [id],
  );
  return results[0] || null;
}

async function getBookingDetailsByBookingId(booking_id) {
  const [results] = await db.query(
    "SELECT * FROM BookingDetails WHERE booking_id = ?",
    [booking_id],
  );
  return results;
}

async function createBookingDetail(booking_id, ticket_id, price = null) {
  const [result] = await db.query(
    "INSERT INTO BookingDetails (booking_id, ticket_id, price) VALUES (?, ?, ?)",
    [booking_id, ticket_id, price],
  );
  return result;
}

async function deleteBookingDetail(id) {
  const [result] = await db.query(
    "DELETE FROM BookingDetails WHERE booking_detail_id = ?",
    [id],
  );
  return result;
}

module.exports = {
  getAllBookingDetails,
  getBookingDetailById,
  getBookingDetailsByBookingId,
  createBookingDetail,
  deleteBookingDetail,
};
