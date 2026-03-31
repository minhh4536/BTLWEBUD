const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/", verifyToken, bookingController.createBooking);
router.get("/:id", verifyToken, bookingController.getBookingWithDetails);

module.exports = router;
