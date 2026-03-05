const express = require("express");
const router = express.Router();
const theaterController = require("../controllers/theater.controller");
router.get("/all", theaterController.getAllTheaters);
router.get("/:id", theaterController.getTheaterById);
router.get("/search", theaterController.getTheaterByName);
router.post("/create", theaterController.createTheater);
router.put("/update/:id", theaterController.updateTheater);
router.delete("/delete/:id", theaterController.deleteTheater);

module.exports = router;
