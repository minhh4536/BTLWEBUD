const genreModel = require("../models/genre.model");

const genreController = {
  getAllGenres: async (req, res) => {
    try {
      const genres = await genreModel.getAllGenres();
      res.json(genres);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getGenreById: async (req, res) => {
    try {
      const genre = await genreModel.getGenreById(req.params.id);
      if (!genre) return res.status(404).json({ message: "Genre not found" });
      res.json(genre);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createGenre: async (req, res) => {
    try {
      const { genre_name } = req.body;
      if (!genre_name)
        return res.status(400).json({ message: "Genre name is required" });

      const result = await genreModel.createGenre(genre_name);
      res
        .status(201)
        .json({ message: "Genre created", genre_id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateGenre: async (req, res) => {
    try {
      const { genre_name } = req.body;
      const result = await genreModel.updateGenre(req.params.id, genre_name);
      res.json({ message: "Genre updated", result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteGenre: async (req, res) => {
    try {
      const result = await genreModel.deleteGenre(req.params.id);
      res.json({ message: "Genre deleted", result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = genreController;
