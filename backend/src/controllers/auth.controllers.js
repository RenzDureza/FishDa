import * as authService from "../services/auth.services.js";
import { validate } from "../utils/validate.js";
import jwt from "jsonwebtoken";
import { verifiedSuccessHTML, verifiedFailHTML } from "../utils/emailTemp.js";

export const register = async (req, res) => {
	const { username, email, password } = req.body;

	const errors = validate({ username, email, password }, ['username', 'email', 'password']);
	if(Object.keys(errors).length > 0){
		return res.status(422).json({
			status: "error", errors
		});
	}

	try {
		const result = await authService.register({ username, email, password });

		res.status(201).json({
			status: "success",
			message: "User Created",
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

		const token = jwt.sign({
			id: userID.userID,
			username: userID.username,
			role: userID.role,
		},
			process.env.JWT_SECRET,
			{ expiresIn: '7d' }
		);

		res.status(200).json({
			status: "success",
			message: "Login successful",
			token
		});
	} catch (err) {
		res.status(err.status ?? 500).json({
			message: err.message
		});
	}
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const result = await authService.verifyEmail(token);
    res.send(verifiedSuccessHTML);
  } catch (err) {
    res.send(verifiedFailHTML);
  }
};