const theaterModel = require("../models/theater.model");

async function getAllTheaters(req, res) {
  try {
    const theaters = await theaterModel.getAllTheater();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getTheaterById(req, res) {
  try {
    const id = req.params.id;
    const theater = await theaterModel.getTheaterById(id);
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }
    res.json(theater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getTheaterByName(req, res) {
  try {
    const name = req.query.name;
    const theaters = await theaterModel.getTheaterByName(name);
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createTheater(req, res) {
  try {
    const { name, address, phone } = req.body;
    if (name === "" || address === "" || phone === "") {
      return res
        .status(400)
        .json({ message: "Name, address, and phone are required" });
    }
    const result = await theaterModel.createTheater(name, address, phone);
    res.status(201).json({ message: "Theater created successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateTheater(req, res) {
  try {
    const id = req.params.id;
    const { name, address, phone } = req.body;
    if (name === "" || address === "" || phone === "") {
      return res
        .status(400)
        .json({ message: "Name, address, and phone are required" });
    }
    const result = await theaterModel.updateTheater(id, name, address, phone);
    res.json({ message: "Theater updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteTheater(req, res) {
  try {
    const id = req.params.id;
    const result = await theaterModel.deleteTheater(id);
    res.json({ message: "Theater deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllTheaters,
  getTheaterById,
  getTheaterByName,
  createTheater,
  updateTheater,
  deleteTheater,
};
