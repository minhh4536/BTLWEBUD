const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genre.controller");

router.post("/create", genreController.createGenre);
router.get("/", genreController.getAllGenres);
router.get("/:id", genreController.getGenreById);
router.put("/:id", genreController.updateGenre);
router.delete("/:id", genreController.deleteGenre);

module.exports = router;
