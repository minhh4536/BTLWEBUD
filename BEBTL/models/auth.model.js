const db = require("../common/db");
const bcrypt = require("bcrypt");

const authModel = {
  getRoleByName: async (role_name) => {
    const [rows] = await db.query(
      "SELECT * FROM UserRoles WHERE role_name = ?",
      [role_name],
    );
    return rows[0];
  },

  createUser: async (username, email, password, role_id) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO Users (username, email, password, role_id) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, role_id],
    );
    return result.insertId;
  },

  createUserProfile: async (
    user_id,
    full_name = "",
    phone = "",
    date_of_birth = null,
    gender = "other",
  ) => {
    await db.query(
      `INSERT INTO UserProfiles (user_id, full_name, phone, date_of_birth, gender) VALUES (?, ?, ?, ?, ?)`,
      [user_id, full_name, phone, date_of_birth, gender],
    );
  },

  getUserByUsername: async (username) => {
    const [rows] = await db.query(
      `SELECT u.*, ur.role_name AS role_name
       FROM Users u
       LEFT JOIN UserRoles ur ON u.role_id = ur.role_id
       WHERE u.username = ?`,
      [username],
    );
    return rows[0];
  },

  getUserById: async (user_id) => {
    const [rows] = await db.query("SELECT * FROM Users WHERE user_id = ?", [
      user_id,
    ]);
    return rows[0];
  },
};

module.exports = authModel;
