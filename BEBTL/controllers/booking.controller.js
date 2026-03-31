const bookingModel = require("../models/booking.model");

const bookingController = {
  // Tạo booking mới
  createBooking: async (req, res) => {
    try {
      const user_id = req.user.userId;
      const { showtime_id, ticket_ids, payment_method = "cash" } = req.body;

      if (
        !showtime_id ||
        !Array.isArray(ticket_ids) ||
        ticket_ids.length === 0
      ) {
        return res.status(400).json({
          message: "Thiếu thông tin bắt buộc: showtime_id, ticket_ids (mảng)",
        });
      }

      const result = await bookingModel.createBooking(
        user_id,
        showtime_id,
        ticket_ids,
        payment_method,
      );

      res.status(201).json({
        message: "Đặt vé thành công",
        ...result,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  },

  // Lấy chi tiết booking + danh sách vé
  getBookingWithDetails: async (req, res) => {
    try {
      const booking = await bookingModel.getBookingWithDetails(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (
        String(req.user.role).toLowerCase() !== "admin" &&
        booking.user_id !== req.user.userId
      ) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền xem booking này" });
      }

      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = bookingController;
