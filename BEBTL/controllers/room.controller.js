const roomModel = require("../models/room.model");

async function getAllRooms(req, res) {
  try {
    const rooms = await roomModel.getAllRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getRoomById(req, res) {
  try {
    const room = await roomModel.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createRoom(req, res) {
  try {
    const { room_number, theater_id } = req.body;
    if (room_number === "" || theater_id === "") {
      return res
        .status(400)
        .json({ message: "Room number and theater ID are required" });
    }
    const result = await roomModel.createRoom(room_number, theater_id);
    res.status(201).json({ message: "Room created successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateRoom(req, res) {
  try {
    const id = req.params.id;
    const { room_number, theater_id } = req.body;
    if (room_number === "" || theater_id === "") {
      return res
        .status(400)
        .json({ message: "Room number and theater ID are required" });
    }
    const result = await roomModel.updateRoom(id, room_number, theater_id);
    res.json({ message: "Room updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteRoom(req, res) {
  try {
    const id = req.params.id;
    const result = await roomModel.deleteRoom(id);
    res.json({ message: "Room deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
