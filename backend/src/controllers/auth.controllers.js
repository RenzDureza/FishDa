import * as authService from "../services/auth.services.js";

export const register = async (req, res) => {
	const { username, email, password } = req.body;

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

