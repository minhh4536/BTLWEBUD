const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userprofile.controller");

router.get("/:userId", userProfileController.getUserProfileByUserId);
router.put("/:userId", userProfileController.updateUserProfile);

module.exports = router;
