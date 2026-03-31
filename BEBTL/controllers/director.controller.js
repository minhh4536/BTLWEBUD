const directorModel = require("../models/director.model");

const directorController = {
  getAllDirectors: async (req, res) => {
    try {
      const directors = await directorModel.getAllDirectors();
      res.json(directors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDirectorById: async (req, res) => {
    try {
      const director = await directorModel.getDirectorById(req.params.id);
      if (!director)
        return res.status(404).json({ message: "Director not found" });
      res.json(director);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDirectorByName: async (req, res) => {
    try {
      const directors = await directorModel.getDirectorByName(
        req.query.name || "",
      );
      res.json(directors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createDirector: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name)
        return res.status(400).json({ message: "Director name is required" });

      const result = await directorModel.createDirector(name);
      res.status(201).json({
        message: "Director created successfully",
        director_id: result.insertId,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateDirector: async (req, res) => {
    try {
      const { name } = req.body;
      const result = await directorModel.updateDirector(req.params.id, name);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Director not found" });
      }

      res.json({ message: "Director updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteDirector: async (req, res) => {
    try {
      const result = await directorModel.deleteDirector(req.params.id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Director not found" });
      }

      res.json({ message: "Director deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = directorController;
