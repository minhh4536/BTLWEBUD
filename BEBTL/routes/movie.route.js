const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");
const upload = require("../common/upload"); // ← Đường dẫn đến file multer config của bạn
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Create movie với upload poster
router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  upload.single("poster"),
  movieController.createMovie,
);

// Update movie với upload poster (nếu có file mới)
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  upload.single("poster"),
  movieController.updateMovie,
);

router.get("/", movieController.getAllMovies);
router.get("/:id", movieController.getMovieById);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  movieController.deleteMovie,
);

module.exports = router;
