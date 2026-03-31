const db = require("../common/db");
const userProfileModel = require("./userprofile.model");

async function getAllUsers(search = null, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const params = [];
  let query = `
    SELECT u.user_id, u.username, u.email, u.status, u.created_at, ur.role_name
    FROM Users u
    LEFT JOIN UserRoles ur ON u.role_id = ur.role_id
  `;

  if (search) {
    query += " WHERE u.username LIKE ? OR u.email LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  query += " ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
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
  await userProfileModel.deleteUserProfile(id);
  const [result] = await db.query("DELETE FROM Users WHERE user_id = ?", [id]);
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
