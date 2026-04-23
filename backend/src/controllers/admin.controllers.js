import * as adminService from "../services/admin.services.js"
import { validate } from "../utils/validate.js";
import jwt from "jsonwebtoken";


export const showUsers = async (req, res) => {
	try {
		const users = await adminService.showUsers();

		if (users.length > 0) {
			res.status(200).json(users);
		} else {
			res.status(404).json({ message: "No users found" });
		}
	} catch (err) {
		res.status(500).json({
			status: "error",
			message: err.message,
		});
	}
};

export const searchUsers = async (req, res) => {
	try {
		const { query } = req.query;
		const users = await adminService.searchUsers(query);

		if (users.length > 0) {
			res.status(200).json(users);
		} else {
			res.status(404).json({ message: "No users found" });
		}
	} catch (err) {
		res.status(500).json({
			status: "error",
			message: err.message,
		});
	}
};