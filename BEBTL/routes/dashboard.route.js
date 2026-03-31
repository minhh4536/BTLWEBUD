const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// GET /api/dashboard
router.get(
  "/",
  verifyToken,
  checkRole(["admin"]),
  dashboardController.getDashboardStats,
);
router.get(
  "/top-movies",
  verifyToken,
  checkRole(["admin"]),
  dashboardController.getTopMovies,
);
module.exports = router;
