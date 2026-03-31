const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, checkRole(["admin"]), userController.getAllUsers);
router.get(
  "/search",
  verifyToken,
  checkRole(["admin"]),
  userController.getUserByName,
);
router.get(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  userController.getUserById,
);
router.post(
  "/create",
  verifyToken,
  checkRole(["admin"]),
  userController.createUser,
);
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  userController.updateUser,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  userController.deleteUser,
);
router.get(
  "/search",
  verifyToken,
  checkRole(["admin"]),
  userController.getUserByName,
);

module.exports = router;
