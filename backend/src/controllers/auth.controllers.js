import * as authService from "../services/auth.services.js";
import { validate } from "../utils/validate.js";
import jwt from "jsonwebtoken";
import { verifiedSuccessHTML, verifiedFailHTML, resetPasswordHTML, resetSuccessHTML } from "../utils/emailTemp.js";

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
		res.status(err.status ?? 400).json({
			status: "error",
			message: err.message
		});
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	const errors = validate({ email, password }, ['email']);
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
		res.status(err.status ?? 400).json({
			status: "error",
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

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await authService.resendVerification(email);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.query;

  if (req.method === "GET") {
    return res.send(resetPasswordHTML(token, process.env.BASE_URL));
  }

  const { token: bodyToken, newPassword } = req.body;
	try {
		await authService.resetPassword(bodyToken, newPassword);
		res.send(resetSuccessHTML);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
export const verifyToken = async (req, res) => {
	try{
		const user = await authService.getUserID(req.user.id);

		const newToken = jwt.sign({
			id: user.id,
			username: user.username,
			role: user.role,
		},
			process.env.JWT_SECRET,
			{ expiresIn: '7d' }
		);

		res.status(200).json({
			status: "success",
			message: "Valid token",
			token: newToken,
		});
	} catch (err) {
		res.status(err.status ?? 400).json({
			status: "error",
			message: err.message,
		});
	}
};