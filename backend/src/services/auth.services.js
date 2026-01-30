import db from "../config/database.js";

export const register = async ({ username, email, password }) => {
  const sql = "INSERT INTO `users` (`username`, `email`, `password`) VALUES (?, ?, ?)";

  const [result] = await db.query(sql, [ username, email, password ]);
  
  return result.insertId;
}
