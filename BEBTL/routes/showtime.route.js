const express = require("express");
const router = express.Router();
const showtimeController = require("../controllers/showtime.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.get("/", showtimeController.getAllShowtimes);
router.get("/current", showtimeController.getCurrentlyShowing);
router.get("/upcoming", showtimeController.getUpcoming);
router.get("/top-booked", showtimeController.getTopBookedCurrentMovies);
router.get("/:id", showtimeController.getShowtimeWithSeats); // ← API lấy sơ đồ ghế động
router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  showtimeController.createShowtime,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  showtimeController.deleteShowtime,
);

module.exports = router;
