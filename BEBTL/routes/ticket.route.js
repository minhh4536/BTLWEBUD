const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.get("/showtime/:showtime_id", ticketController.getTicketsByShowtime);
router.patch(
  "/:id/status",
  verifyToken,
  checkRole(["admin"]),
  ticketController.updateTicketStatus,
);

module.exports = router;
