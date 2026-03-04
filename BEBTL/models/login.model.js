const db = require("../common/db");

async function login(x, password) {
  const [rows] = await db.query(
    "SELECT * FROM Users WHERE (email = ? OR username = ?) AND password = ?",
    [x, x, password],
  );

  return rows[0];
}

module.exports = {
  login,
};
