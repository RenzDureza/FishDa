import db from "../config/database.js";

export const showUsers = async () => {
	const [records] = await db.query("SELECT `id`, `username` FROM `users` WHERE `role` != 'admin'");

	return records;
};

export const searchUsers = async (query) => {
	const [records] = await db.query("SELECT `id`, `username` FROM `users` WHERE  `role` != 'admin' AND `username` LIKE ?", [`${query}%`]);

	return records;
};