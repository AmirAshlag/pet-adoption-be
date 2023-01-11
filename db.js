const mysql = require("mysql");
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "petdb",
  port: "8889",
})

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("mysql connected");
  }
});
module.exports = db;
