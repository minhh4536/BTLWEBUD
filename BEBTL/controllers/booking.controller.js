const bookingModel = require("../models/booking.model");
const { v4: uuidv4 } = require("uuid");

async function createBooking(req, res) {
  try {
    const { user_id, showtime_id, total_amount } = req.body;
    const booking_code = uuidv4();
    const result = await bookingModel.createBooking(
      user_id,
      booking_code,
      showtime_id,
      total_amount,
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllBookings(req, res) {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    const booking = await bookingModel.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    const { user_id, booking_code, showtime_id, total_amount } = req.body;
    const result = await bookingModel.updateBooking(
      id,
      user_id,
      booking_code,
      showtime_id,
      total_amount,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteBooking(req, res) {
  try {
    const { id } = req.params;
    const result = await bookingModel.deleteBooking(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
