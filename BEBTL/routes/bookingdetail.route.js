const express = require("express");
const router = express.Router();
const bookingDetailController = require("../controllers/bookingdetail.controller");

router.post("/", bookingDetailController.createBookingDetail);
router.get("/", bookingDetailController.getAllBookingDetails);
router.get("/:id", bookingDetailController.getBookingDetailById);
router.delete("/:id", bookingDetailController.deleteBookingDetail);

module.exports = router;
