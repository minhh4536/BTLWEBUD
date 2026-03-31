const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seat.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.get(
  "/all",
  verifyToken,
  checkRole(["admin"]),
  seatController.getAllSeats,
);
router.get(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  seatController.getSeatById,
);
router.get(
  "/booking/:booking_id",
  verifyToken,
  seatController.getSeatsByBookingId,
);
router.get("/showtime/:showtime_id", seatController.getALLSeatsByShowtimeId);
router.post(
  "/create",
  verifyToken,
  checkRole(["admin"]),
  seatController.createSeat,
);
router.put(
  "/update/:id",
  verifyToken,
  checkRole(["admin"]),
  seatController.updateSeat,
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkRole(["admin"]),
  seatController.deleteSeat,
);
router.get(
  "/available/:showtime_id",
  seatController.getSeatsAvailableByShowtimeId,
);

module.exports = router;
