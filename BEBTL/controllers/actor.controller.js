const actorModel = require("../models/actor.model");

const actorController = {
  getAllActors: async (req, res) => {
    try {
      const actors = await actorModel.getAllActors();
      res.json(actors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getActorById: async (req, res) => {
    try {
      const actor = await actorModel.getActorById(req.params.id);
      if (!actor) return res.status(404).json({ message: "Actor not found" });
      res.json(actor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getActorByName: async (req, res) => {
    try {
      const actors = await actorModel.getActorByName(req.query.name || "");
      res.json(actors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createActor: async (req, res) => {
    try {
      const { name, avatar } = req.body;
      if (!name)
        return res.status(400).json({ message: "Actor name is required" });

      const result = await actorModel.createActor(name, avatar);
      res.status(201).json({
        message: "Actor created successfully",
        actor_id: result.insertId,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateActor: async (req, res) => {
    try {
      const { name, avatar } = req.body;
      const result = await actorModel.updateActor(req.params.id, name, avatar);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Actor not found" });
      }

      res.json({ message: "Actor updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteActor: async (req, res) => {
    try {
      const result = await actorModel.deleteActor(req.params.id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Actor not found" });
      }

      res.json({ message: "Actor deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = actorController;
