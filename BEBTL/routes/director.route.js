const express = require("express");
const router = express.Router();
const directorController = require("../controllers/director.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.get("/", directorController.getAllDirectors);
router.get("/search", directorController.getDirectorByName); // GET /directors/search?name=...
router.get("/:id", directorController.getDirectorById);
router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  directorController.createDirector,
);
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  directorController.updateDirector,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  directorController.deleteDirector,
);

module.exports = router;
