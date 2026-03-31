const db = require("../common/db");

async function getAllPayments(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const [results] = await db.query(
    `SELECT * FROM Payments ORDER BY payment_date DESC LIMIT ? OFFSET ?`,
    [limit, offset],
  );
  return results;
}

async function getPaymentById(payment_id) {
  const [results] = await db.query(
    "SELECT * FROM Payments WHERE payment_id = ?",
    [payment_id],
  );
  return results[0] || null;
}

async function createPayment(
  booking_id,
  payment_method,
  transaction_code,
  payment_date,
) {
  const [result] = await db.query(
    "INSERT INTO Payments (booking_id, payment_method, transaction_code, payment_date) VALUES (?, ?, ?, ?)",
    [booking_id, payment_method, transaction_code, payment_date],
  );
  return result;
}

async function updatePayment(
  payment_id,
  booking_id,
  payment_method,
  transaction_code,
  payment_date,
) {
  const [result] = await db.query(
    "UPDATE Payments SET booking_id = ?, payment_method = ?, transaction_code = ?, payment_date = ? WHERE payment_id = ?",
    [booking_id, payment_method, transaction_code, payment_date, payment_id],
  );
  return result;
}

async function updatePaymentStatus(payment_id, payment_status) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [paymentRows] = await connection.query(
      "SELECT * FROM Payments WHERE payment_id = ?",
      [payment_id],
    );
    if (paymentRows.length === 0) {
      await connection.rollback();
      return null;
    }

    const payment = paymentRows[0];
    const [bookingRows] = await connection.query(
      "SELECT * FROM Bookings WHERE booking_id = ?",
      [payment.booking_id],
    );
    if (bookingRows.length === 0) {
      await connection.rollback();
      return null;
    }

    await connection.query(
      "UPDATE Payments SET payment_status = ? WHERE payment_id = ?",
      [payment_status, payment_id],
    );

    if (payment_status === "success") {
      await connection.query(
        "UPDATE Bookings SET booking_status = 'paid' WHERE booking_id = ?",
        [payment.booking_id],
      );
    }

    if (payment_status === "failed") {
      await connection.query(
        "UPDATE Bookings SET booking_status = 'cancelled' WHERE booking_id = ?",
        [payment.booking_id],
      );
      await connection.query(
        `UPDATE Tickets t
         JOIN BookingDetails bd ON t.ticket_id = bd.ticket_id
         SET t.status = 'available'
         WHERE bd.booking_id = ?`,
        [payment.booking_id],
      );
    }

    await connection.commit();
    return { payment, booking_id: payment.booking_id };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function deletePayment(payment_id) {
  const [result] = await db.query("DELETE FROM Payments WHERE payment_id = ?", [
    payment_id,
  ]);
  return result;
}

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  updatePaymentStatus,
  deletePayment,
};
