const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userprofile.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get(
  "/:userId",
  verifyToken,
  userProfileController.getUserProfileByUserId,
);
router.put("/:userId", verifyToken, userProfileController.updateUserProfile);

module.exports = router;
