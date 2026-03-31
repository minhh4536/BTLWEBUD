const seatTypeModel = require("../models/seattype.model");

const seatTypeController = {
  getAllSeatTypes: async (req, res) => {
    try {
      const seatTypes = await seatTypeModel.getAllSeatTypes();
      res.json(seatTypes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSeatTypeById: async (req, res) => {
    try {
      const seatType = await seatTypeModel.getSeatTypeById(req.params.id);
      if (!seatType)
        return res.status(404).json({ message: "SeatType not found" });
      res.json(seatType);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSeatTypeByName: async (req, res) => {
    try {
      const seatTypes = await seatTypeModel.getSeatTypeByName(
        req.query.name || "",
      );
      res.json(seatTypes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createSeatType: async (req, res) => {
    try {
      const { name, surcharge = 0 } = req.body;
      if (!name)
        return res.status(400).json({ message: "Seat type name is required" });

      const result = await seatTypeModel.createSeatType(name, surcharge);
      res.status(201).json({
        message: "SeatType created successfully",
        seat_type_id: result.insertId,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateSeatType: async (req, res) => {
    try {
      const { name, surcharge } = req.body;
      const result = await seatTypeModel.updateSeatType(
        req.params.id,
        name,
        surcharge,
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "SeatType not found" });
      }

      res.json({ message: "SeatType updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteSeatType: async (req, res) => {
    try {
      const result = await seatTypeModel.deleteSeatType(req.params.id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "SeatType not found" });
      }

      res.json({ message: "SeatType deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = seatTypeController;
