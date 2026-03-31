const express = require("express");
const router = express.Router();
const theaterController = require("../controllers/theater.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");
router.get("/all", theaterController.getAllTheaters);
router.get("/search", theaterController.getTheaterByName);
router.get("/:id", theaterController.getTheaterById);
router.post(
  "/create",
  verifyToken,
  checkRole(["admin"]),
  theaterController.createTheater,
);
router.put(
  "/update/:id",
  verifyToken,
  checkRole(["admin"]),
  theaterController.updateTheater,
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkRole(["admin"]),
  theaterController.deleteTheater,
);

module.exports = router;
