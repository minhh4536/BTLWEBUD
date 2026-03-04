const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");

router.get("/all", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.post("/create", roomController.createRoom);
router.put("/update/:id", roomController.updateRoom);
router.delete("/delete/:id", roomController.deleteRoom);
module.exports = router;
