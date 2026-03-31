const roomModel = require("../models/room.model");

const roomController = {
  getAllRooms: async (req, res) => {
    try {
      const rooms = await roomModel.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getRoomWithSeats: async (req, res) => {
    try {
      const room = await roomModel.getRoomWithSeats(req.params.id);
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createRoom: async (req, res) => {
    try {
      const { theater_id, room_name, num_rows, num_cols } = req.body;

      if (!theater_id || !room_name || !num_rows || !num_cols) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await roomModel.createRoom(
        theater_id,
        room_name,
        num_rows,
        num_cols,
      );

      res.status(201).json({
        message: "Room created successfully with seats",
        ...result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  deleteRoom: async (req, res) => {
    try {
      await roomModel.deleteRoom(req.params.id);
      res.json({ message: "Room and all seats deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = roomController;
