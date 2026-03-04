const paymentModel = require("../models/payment.model");

async function createPayment(req, res) {
  try {
    const { booking_id, payment_method, transaction_code, payment_date } =
      req.body;
    const result = await paymentModel.createPayment(
      booking_id,
      payment_method,
      transaction_code,
      payment_date,
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllPayments(req, res) {
  try {
    const payments = await paymentModel.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPaymentById(req, res) {
  try {
    const { id } = req.params;
    const payment = await paymentModel.getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updatePayment(req, res) {
  try {
    const { id } = req.params;
    const { booking_id, payment_method, transaction_code, payment_date } =
      req.body;
    const result = await paymentModel.updatePayment(
      id,
      booking_id,
      payment_method,
      transaction_code,
      payment_date,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deletePayment(req, res) {
  try {
    const { id } = req.params;
    const result = await paymentModel.deletePayment(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
