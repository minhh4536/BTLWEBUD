const db = require("../common/db");

async function getAllPayments() {
  const [results] = await db.query("SELECT * FROM payments");
  return results;
}

async function getPaymentById(id) {
  const [results] = await db.query("SELECT * FROM payments WHERE id = ?", [id]);
  return results;
}

async function createPayment(
  booking_id,
  payment_method,
  transaction_code,
  payment_date,
) {
  const [result] = await db.query(
    "INSERT INTO payments (booking_id, payment_method, transaction_code, payment_date) VALUES (?, ?, ?, ?, ?)",
    [booking_id, payment_method, transaction_code, payment_date],
  );
  return result;
}

async function updatePayment(
  id,
  booking_id,
  payment_method,
  transaction_code,
  payment_date,
) {
  const [result] = await db.query(
    "UPDATE payments SET booking_id = ?, payment_method = ?, transaction_code = ?, payment_date = ? WHERE id = ?",
    [booking_id, payment_method, transaction_code, payment_date, id],
  );
  return result;
}

async function deletePayment(id) {
  const [result] = await db.query("DELETE FROM payments WHERE id = ?", [id]);
  return result;
}

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
};