import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fishda"
});

db.connect(function (err) {
  if (err) {
    console.log("Connection failed:", err.message);
    return;
  }
  console.log("Successfully connected to " + db.config.user);
});

export default db;
