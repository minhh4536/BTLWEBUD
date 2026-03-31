const booikingDetailModel = require("../models/bookingdetail.model");

async function createBookingDetail(req, res) {
  try {
    const { booking_id, ticket_id, price } = req.body;
    if (!booking_id || !ticket_id) {
      return res
        .status(400)
        .json({ error: "booking_id and ticket_id are required" });
    }
    const result = await booikingDetailModel.createBookingDetail(
      booking_id,
      ticket_id,
      price,
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllBookingDetails(req, res) {
  try {
    const bookingDetails = await booikingDetailModel.getAllBookingDetails();
    res.status(200).json(bookingDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getBookingDetailById(req, res) {
  try {
    const { id } = req.params;
    const bookingDetail = await booikingDetailModel.getBookingDetailById(id);
    if (!bookingDetail) {
      return res.status(404).json({ error: "Booking detail not found" });
    }
    res.status(200).json(bookingDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteBookingDetail(req, res) {
  try {
    const { id } = req.params;
    const result = await booikingDetailModel.deleteBookingDetail(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createBookingDetail,
  getAllBookingDetails,
  getBookingDetailById,
  deleteBookingDetail,
};
