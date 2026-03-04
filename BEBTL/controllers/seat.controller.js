const seatModel = require("../models/seat.model");

async function getAllSeats(req, res) {
  try {
    const seats = await seatModel.getAllSeats();
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSeatById(req, res) {
  try {
    const id = req.params.id;
    const seat = await seatModel.getSeatById(id);
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }
    res.json(seat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createSeat(req, res) {
  try {
    const { seat_number, room_id } = req.body;
    if (seat_number === "" || room_id === "") {
      return res
        .status(400)
        .json({ message: "Seat number and room ID are required" });
    }
    const result = await seatModel.createSeat(seat_number, room_id);
    res.status(201).json({ message: "Seat created successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSeat(req, res) {
  try {
    const id = req.params.id;
    const { seat_number, room_id } = req.body;
    if (seat_number === "" || room_id === "") {
      return res
        .status(400)
        .json({ message: "Seat number and room ID are required" });
    }
    const result = await seatModel.updateSeat(id, seat_number, room_id);
    res.json({ message: "Seat updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteSeat(req, res) {
  try {
    const id = req.params.id;
    const result = await seatModel.deleteSeat(id);
    res.json({ message: "Seat deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSeatsByBookingId(req, res) {
  try {
    const booking_id = req.params.booking_id;
    const seats = await seatModel.getSeatsByBookingId(booking_id);
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getALLSeatsByShowtimeId(req, res) {
  try {
    const showtime_id = req.params.showtime_id;
    const seats = await seatModel.getALLSeatsByShowtimeId(showtime_id);
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllSeats,
  getSeatById,
  createSeat,
  updateSeat,
  deleteSeat,
  getSeatsByBookingId,
  getALLSeatsByShowtimeId,
};
