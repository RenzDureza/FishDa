import db from "../config/database.js";


export const showUsers = async () => {
	const sql = "SELECT `id`, `username` FROM `users`";

	const [result] = await db.query(sql);

	return result
}
