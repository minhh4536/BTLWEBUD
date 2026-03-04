const db = require("../common/db");
const userProfileModel = require("./userprofile.model");

async function getAllUsers() {
  const [rows] = await db.query("SELECT * FROM Users");
  return rows;
}

async function getUserById(id) {
  const [rows] = await db.query("SELECT * FROM Users Where user_id = ?", [id]);
  return rows[0];
}

async function getUserByName(username) {
  const [rows] = await db.query("SELECT * FROM Users Where username like ?", [
    `%${username}%`,
  ]);
  return rows[0];
}

async function createUser(username, email, password) {
  const [result] = await db.query(
    "INSERT INTO Users (role_id,username,email,password) VALUES (?, ?, ?, ?)",
    [3, username, email, password],
  );
  await userProfileModel.createUserProfileEmpty(result.insertId);
  return result;
}

async function deleteUser(id) {
  const [result] = await db.query("DELETE FROM Users WHERE user_id = ?", [id]);
  await userProfileModel.deleteUserProfile(id);
  return result;
}

async function updateUser(id, username, email, password) {
  const [result] = await db.query(
    "UPDATE Users SET username = ?, email = ?, password = ? WHERE user_id = ?",
    [username, email, password, id],
  );
  return result;
}

async function checkUserExists(username, email) {
  const [rows] = await db.query(
    "SELECT * FROM Users WHERE email = ? OR username = ?",
    [email, username],
  );
  return rows.length > 0;
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByName,
  createUser,
  deleteUser,
  updateUser,
  checkUserExists,
};
