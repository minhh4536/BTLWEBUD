const genreModel = require("../models/genre.model");

async function getAllGenres(req, res) {
  try {
    const genres = await genreModel.getAllGenres();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getGenreByName(req, res) {
  try {
    const { name } = req.params;
    const genre = await genreModel.getGenreByName(name);
    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }
    res.json(genre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createGenre(req, res) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Genre name is required" });
    }
    const result = await genreModel.createGenre(name);
    res.status(201).json({ message: "Genre created successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateGenre(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Genre name is required" });
    }
    const result = await genreModel.updateGenre(id, name);
    res.json({ message: "Genre updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteGenre(req, res) {
  try {
    const { id } = req.params;
    const result = await genreModel.deleteGenre(id);
    res.json({ message: "Genre deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllGenres,
  getGenreByName,
  createGenre,
  updateGenre,
  deleteGenre,
};
