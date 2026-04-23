import db from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendResetEmail } from "../utils/mailer.js";

export const register = async ({ username, email, password }) => {
	if (!username || !email || !password) {
		throw new Error("All fields are required");
	}

	const [exist] = await db.query("SELECT 1 FROM users WHERE email = ?", [email]);

	if (exist.length) {
		throw new Error("Email already exists");
	}

	const hashed_pass = await bcrypt.hash(password, 10);

	const verificationToken = jwt.sign(
		{ email },
		process.env.JWT_SECRET,
		{ expiresIn: "5m" }
	);

	const sql = "INSERT INTO `users` (`username`, `email`, `password`, `verification_token`) VALUES (?, ?, ?, ?)";
	const [result] = await db.query(sql, [username, email, hashed_pass, verificationToken]);

	const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
	await sendVerificationEmail(email, verificationLink);

	return {
		status: "success",
		message: "Registered! Please Check your email for verification.",
		userID: result.insertId
	};
};

export const login = async ({ email, password }) => {
	const [records] = await db.query("SELECT `id`, `username`, `password`, `role`, `is_verified` FROM `users` WHERE `email` = ?", [email]);

	if(!records.length){
		throw new Error("User not found");
	}

	const user = records[0];

	if (!user.is_verified) {
		const error = new Error("Please verify your email before logging in.");
		error.status = 403;
		throw error;
 	}

	const isMatch = await bcrypt.compare(password, user.password);
	if(!isMatch){
		throw new Error("Invalid Email or Password");
	}

	return {
		status: "success",
		message: "User Logged In Successfully",
		userID: user.id,
		username: user.username,
		role: user.role
	};
};

export const verifyEmail = async (token) => {
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

  	const [records] = await db.query(
    	"SELECT id, is_verified FROM users WHERE email = ?",
    	[decoded.email]
	);

	if (!records.length) throw new Error("Invalid token");
	if (records[0].is_verified) throw new Error("Email already verified");

	await db.query(
    	"UPDATE users SET is_verified = 1, verification_token = NULL WHERE email = ?",
    	[decoded.email]
	);

	return { status: "success", message: "Email verified! You can now log in." };
};

export const resendVerification = async (email) => {
	const [records] = await db.query(
    	"SELECT id, is_verified FROM users WHERE email = ?",
    	[email]
	);

	if (!records.length) throw new Error("Email not Found");
	if (records[0].is_verified) throw new Error("Email already verified");

	const verificationToken = jwt.sign(
		{ email },
		process.env.JWT_SECRET,
		{ expiresIn: "5m"}
	);

	await db.query(
		"UPDATE users SET verification_token = ? WHERE email = ?",
		[verificationToken, email]
  	);

	const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
	await sendVerificationEmail(email, verificationLink);

	return { status: "success", message: "Verification email resent!"}
};

export const forgotPassword = async (email) => {
	const [records] = await db.query(
		"SELECT id FROM users WHERE email = ?",
		[email]
	);

	if (!records.length) return { status: "success", message: "A Reset Link has been sent." };

	const resetToken = jwt.sign(
		{ email },
		process.env.JWT_SECRET,
		{ expiresIn: "10m"}
	);

	const expiry = new Date(Date.now() + 10 * 60 * 1000);

	await db.query(
		"UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
		[resetToken, expiry, email]
	);

	const resetLink = `${process.env.BASE_URL}/api/auth/reset-password?token=${resetToken}`;
 	await sendResetEmail(email, resetLink);

  	return { status: "success", message: "A reset link has been sent." };

};

export const resetPassword = async (token, newPassword) => {
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	const [records] = await db.query(
		"SELECT id, reset_token, reset_token_expiry FROM users WHERE email = ?",
		[decoded.email]
	);

	if (!records.length) throw new Error("Invalid Token");

	const user = records[0];

	if (user.reset_token !== token) throw new Error("Invalid or already used token");
	if (new Date() > new Date(user.reset_token_expiry)) throw new Error("Reset Link has expired.");

	const hashed = await bcrypt.hash(newPassword, 10);

	console.log("Hashed password generated");

	await db.query(
		"UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
		[hashed, decoded.email]
	);

	return { status: "success", message: "Password Reset Sucessfully!"}
};
export const getUserID = async (id) => {
	const [records] = await db.query("SELECT `id`, `username`, `role` FROM `users` WHERE `id` = ?", [id]);

	if(!records.length){
		throw new Error("User not found");
	}

	return records[0];
};