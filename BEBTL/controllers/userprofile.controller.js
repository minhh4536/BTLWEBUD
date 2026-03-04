const userprofileModel = require("../models/userprofile.model");

async function getUserProfileByUserId(req, res) {
  try {
    const userId = req.params.userId;
    const userProfile = await userprofileModel.getUserProfileByUserId(userId);
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function updateUserProfile(req, res) {
  try {
    const userId = req.params.userId;
    const { full_name, phone, date_of_birth, gender } = req.body;
    const result = await userprofileModel.updateUserProfile(
      userId,
      full_name,
      phone,
      date_of_birth,
      gender,
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

module.exports = {
  getUserProfileByUserId,
  updateUserProfile,
};
