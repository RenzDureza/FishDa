import db from "../config/database.js";
import bcrypt from "bcryptjs";

export const register = async ({ username, email, password }) => {
  const sql = "INSERT INTO `users` (`username`, `email`, `password`) VALUES (?, ?, ?)";

  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }

  const exist = await db.query("SELECT 1 FROM users WHERE email = ?", email);

  if (exist.length) {
    throw new Error("Email already exists");
  }

  const hashed_pass = await bcrypt.hash(password, 10);

  const [result] = await db.query(sql, [ username, email, hashed_pass ]);
  
  return result.insertId;
}
