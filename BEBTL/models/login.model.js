const db = require("../common/db");

async function login(x) {
  const [rows] = await db.query(
    "SELECT * FROM Users WHERE (email = ? OR username = ?)",
    [x, x],
  );

  return rows[0];
}

module.exports = {
  login,
};
