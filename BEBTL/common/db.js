const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Huong4536@",
  database: "movie_booking",
});

module.exports = db.promise();
