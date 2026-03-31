const express = require("express");
const router = express.Router();
const seatTypeController = require("../controllers/seattype.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.get("/", seatTypeController.getAllSeatTypes);
router.get("/search", seatTypeController.getSeatTypeByName); // GET /seattypes/search?name=...
router.get("/:id", seatTypeController.getSeatTypeById);
router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  seatTypeController.createSeatType,
);
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  seatTypeController.updateSeatType,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  seatTypeController.deleteSeatType,
);

module.exports = router;
