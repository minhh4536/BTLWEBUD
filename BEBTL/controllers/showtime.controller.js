const showtimeModel = require("../models/showtime.model");

const showtimeController = {
  getAllShowtimes: async (req, res) => {
    try {
      const showtimes = await showtimeModel.getAllShowtimes();
      res.json(showtimes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCurrentlyShowing: async (req, res) => {
    try {
      const showtimes = await showtimeModel.getCurrentlyShowing();
      res.json(showtimes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUpcoming: async (req, res) => {
    try {
      const movies = await showtimeModel.getUpcoming();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTopBookedCurrentMovies: async (req, res) => {
    try {
      const topMovies = await showtimeModel.getTopBookedCurrentMovies();
      res.json(topMovies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getShowtimeWithSeats: async (req, res) => {
    try {
      const showtime = await showtimeModel.getShowtimeById(req.params.id);
      if (!showtime)
        return res.status(404).json({ message: "Showtime not found" });
      res.json(showtime);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createShowtime: async (req, res) => {
    try {
      const {
        movie_id,
        room_id,
        show_date,
        start_time,
        end_time,
        format,
        price,
      } = req.body;

      if (
        !movie_id ||
        !room_id ||
        !show_date ||
        !start_time ||
        !end_time ||
        !price
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await showtimeModel.createShowtime(
        movie_id,
        room_id,
        show_date,
        start_time,
        end_time,
        format,
        price,
      );

      res.status(201).json({
        message: "Showtime created successfully with tickets generated",
        showtime_id: result.showtime_id,
      });
    } catch (error) {
      console.error(error);
      if (error.message.includes("trùng") || error.message.includes("trùng")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  deleteShowtime: async (req, res) => {
    try {
      const result = await showtimeModel.deleteShowtime(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message.includes("Không thể xóa suất chiếu")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = showtimeController;
