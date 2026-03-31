const express = require("express");
const router = express.Router();
const bookingDetailController = require("../controllers/bookingdetail.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  bookingDetailController.createBookingDetail,
);
router.get(
  "/",
  verifyToken,
  checkRole(["admin"]),
  bookingDetailController.getAllBookingDetails,
);
router.get(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  bookingDetailController.getBookingDetailById,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  bookingDetailController.deleteBookingDetail,
);

module.exports = router;
