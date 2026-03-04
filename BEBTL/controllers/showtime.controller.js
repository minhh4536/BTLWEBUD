const showtimeModel = require("../models/showtime.model");

async function getAllShowtimes(req, res) {
  try {
    const showtimes = await showtimeModel.getAllShowtimes();
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getShowtimeById(req, res) {
  try {
    const id = req.params.id;
    const showtime = await showtimeModel.getShowtimeById(id);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getShowtimesByMovieId(req, res) {
  try {
    const movie_id = req.params.movie_id;
    const showtimes = await showtimeModel.getShowtimesByMovieId(movie_id);
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getShowtimesByShowDateAndMovie(req, res) {
  try {
    const { show_date, movie_id } = req.query;
    const showtimes = await showtimeModel.getShowtimesByShowDateAndMovie(
      show_date,
      movie_id,
    );
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createShowtime(req, res) {
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
      await showtimeModel.checkTimeConflict(
        room_id,
        show_date,
        start_time,
        end_time,
      )
    ) {
      return res
        .status(400)
        .json({ message: "Time conflict with existing showtime" });
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
    res.status(201).json({ message: "Showtime created successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateShowtime(req, res) {
  try {
    const id = req.params.id;
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
      await showtimeModel.checkTimeConflict(
        room_id,
        show_date,
        start_time,
        end_time,
      )
    ) {
      return res
        .status(400)
        .json({ message: "Time conflict with existing showtime" });
    }
    const result = await showtimeModel.updateShowtime(
      id,
      movie_id,
      room_id,
      show_date,
      start_time,
      end_time,
      format,
      price,
    );
    res.json({ message: "Showtime updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteShowtime(req, res) {
  try {
    const id = req.params.id;
    const result = await showtimeModel.deleteShowtime(id);
    res.json({ message: "Showtime deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllShowtimes,
  getShowtimeById,
  getShowtimesByMovieId,
  getShowtimesByShowDateAndMovie,
  createShowtime,
  updateShowtime,
  deleteShowtime,
};
