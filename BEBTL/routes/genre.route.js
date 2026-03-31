const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genre.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.get("/", genreController.getAllGenres);
router.get("/:id", genreController.getGenreById);
router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  genreController.createGenre,
);
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  genreController.updateGenre,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  genreController.deleteGenre,
);

module.exports = router;
