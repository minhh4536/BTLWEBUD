const upload = require("../common/upload");
const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.post("/create", upload.single("poster"), movieController.createMovie);
router.get("/all", movieController.getAllMovies);
router.get("/:id", movieController.getMovieById);
router.put("/update/:id", upload.single("poster"), movieController.updateMovie);
router.delete("/delete/:id", movieController.deleteMovie);
router.get("/search", movieController.searchMovies);
router.get("/genre/:genre_id", movieController.getMoviesByGenre);
router.get(
  "/release_date/:release_date",
  movieController.getMoviesByReleaseDate,
);
router.get("/title/:title", movieController.getMoviesByTitle);
router.get("/director/:director", movieController.getMoviesByDirector);
router.get("/actor/:actor", movieController.getMoviesByActor);

module.exports = router;
