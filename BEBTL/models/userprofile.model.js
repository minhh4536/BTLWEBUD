const db = require("../common/db");

async function getUserProfilesByUserId(userId) {
  const [rows] = await db.query(
    "SELECT * FROM UserProfiles WHERE user_id = ?",
    [userId],
  );
  return rows[0];
}

async function createUserProfileEmpty(user_id) {
  const [result] = await db.query(
    "INSERT INTO UserProfiles (user_id) VALUES (?)",
    [user_id],
  );
  return result;
}

async function updateUserProfile(id, full_name, phone, date_of_birth, gender) {
  const [result] = await db.query(
    "UPDATE UserProfiles SET full_name = ?, phone = ?, date_of_birth = ?, gender = ? WHERE user_id = ?",
    [full_name, phone, date_of_birth, gender, id],
  );
  return result;
}

async function deleteUserProfile(id) {
  const [result] = await db.query(
    "DELETE FROM UserProfiles WHERE user_id = ?",
    [id],
  );
  return result;
}

module.exports = {
  getUserProfilesByUserId,
  updateUserProfile,
  deleteUserProfile,
  createUserProfileEmpty,
};
