const movieModel = require("../models/movie.model");

const movieController = {
  getAllMovies: async (req, res) => {
    try {
      const { genre_id, search } = req.query;
      const movies = await movieModel.getAllMovies(genre_id, search);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMovieById: async (req, res) => {
    try {
      const movie = await movieModel.getMovieById(req.params.id);
      if (!movie) return res.status(404).json({ message: "Movie not found" });
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ==================== CREATE MOVIE ====================
  createMovie: async (req, res) => {
    try {
      const { genre_ids, actor_ids, director_ids, ...movieData } = req.body;

      // Xử lý poster từ multer
      if (req.file) {
        movieData.poster = `/uploads/${req.file.filename}`;
      }

      const result = await movieModel.createMovie(
        movieData,
        genre_ids ? JSON.parse(genre_ids) : [],
        actor_ids ? JSON.parse(actor_ids) : [],
        director_ids ? JSON.parse(director_ids) : [],
      );

      res.status(201).json({
        message: "Movie created successfully",
        movie_id: result.movie_id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // ==================== UPDATE MOVIE ====================
  updateMovie: async (req, res) => {
    try {
      const { genre_ids, actor_ids, director_ids, ...movieData } = req.body;

      // Nếu có file poster mới thì cập nhật
      if (req.file) {
        movieData.poster = `/uploads/${req.file.filename}`;
      }

      await movieModel.updateMovie(
        req.params.id,
        movieData,
        genre_ids ? JSON.parse(genre_ids) : [],
        actor_ids ? JSON.parse(actor_ids) : [],
        director_ids ? JSON.parse(director_ids) : [],
      );

      res.json({ message: "Movie updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  deleteMovie: async (req, res) => {
    try {
      await movieModel.deleteMovie(req.params.id);
      res.json({ message: "Movie deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = movieController;
