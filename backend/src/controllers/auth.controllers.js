import * as authService from "../services/auth.services.js";
import { validate } from "../utils/validate.js";

export const register = async (req, res) => {
	const { username, email, password } = req.body;

	const errors = validate({ username, email, password }, ['username', 'email', 'password']);
	if(Object.keys(errors).length > 0){
		return res.status(422).json({
			status: "error", errors
		});
	}

	try {
		const userID = await authService.register({
			username,
			email,
			password
		});

		res.status(201).json({
			status: "success",
			message: "User Created",
			id: userID
		});
	} catch (err) {
		res.status(500).json({
			message: err.message
		});
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	const errors = validate({ email, password }, ['email', 'password']);
	if(Object.keys(errors).length > 0){
		return res.status(422).json({
			status: "error", errors
		});
	}

	try {
		const userID = await authService.login({
			email,
			password
		});

		res.status(200).json({
			status: "success",
			message: "Login successful",
			id: userID.userID,
			username: userID.username,
			role: userID.role
		});
	} catch (err) {
		res.status(500).json({
			message: err.message
		});
	}
};

