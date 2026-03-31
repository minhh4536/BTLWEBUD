const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomWithSeats);
router.post("/", verifyToken, checkRole(["admin"]), roomController.createRoom);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  roomController.deleteRoom,
);

module.exports = router;
