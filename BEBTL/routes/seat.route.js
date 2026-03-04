const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seat.controller");

router.get("/all", seatController.getAllSeats);
router.get("/:id", seatController.getSeatById);
router.get("/booking/:booking_id", seatController.getSeatsByBookingId);
router.get("/showtime/:showtime_id", seatController.getALLSeatsByShowtimeId);
router.post("/create", seatController.createSeat);
router.put("/update/:id", seatController.updateSeat);
router.delete("/delete/:id", seatController.deleteSeat);
module.exports = router;
