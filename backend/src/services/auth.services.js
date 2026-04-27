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

	const [result] = await db.query(
		"INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
		[username, email, hashed_pass]);

	const verificationToken = jwt.sign(
		{ email },
		process.env.JWT_SECRET,
		{ expiresIn: "5m" }
	);

	const expiry = new Date(Date.now() + 5 * 60 * 1000);

	await db.query(
		"INSERT INTO user_tokens (user_id, type, token, expires_at) VALUES (?, 'verification', ?, ?)",
		[result.insertId, verificationToken, expiry]
	);

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
		throw new Error("Invalid Email or Password");
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
		id: user.id,
		username: user.username,
		role: user.role
	};
};

export const verifyEmail = async (token) => {
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

  	const [records] = await db.query(
    	"SELECT ut.id, ut.used FROM user_tokens ut JOIN users u ON ut.user_id = u.id WHERE u.email = ? AND ut.type = 'verification' AND ut.token = ?",
    	[decoded.email, token]
	);

	if (!records.length) throw new Error("Invalid token");
	if (records[0].used) throw new Error("Email already verified");

	await db.query("UPDATE user_tokens SET used = 1 WHERE id = ?", [records[0].id]);
	await db.query("UPDATE users SET is_verified = 1 WHERE email = ?", [decoded.email]);

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

	const expiry = new Date(Date.now() + 5 * 60 * 1000);

	await db.query(
		"INSERT INTO user_token (user_id, type, token, expires_at) VALUES (?, 'verification', ?, ?)",
		[records[0].id, verificationToken, expiry]
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

	const userId = records[0].id;

	await db.query(
    "UPDATE user_tokens SET used = 1 WHERE user_id = ? AND type = 'reset'",
    [userId]
  );

	const resetToken = jwt.sign(
		{ email },
		process.env.JWT_SECRET,
		{ expiresIn: "10m"}
	);

	const expiry = new Date(Date.now() + 10 * 60 * 1000);

	await db.query(
		"INSERT INTO user_tokens(user_id, type, token, expires_at) VALUES (?, 'reset', ?, ?)",
		[userId, resetToken, expiry]
	);

	const resetLink = `${process.env.BASE_URL}/api/auth/reset-password?token=${resetToken}`;
 	await sendResetEmail(email, resetLink);

  	return { status: "success", message: "A reset link has been sent." };

};

export const resetPassword = async (token, newPassword) => {
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	const [records] = await db.query(
		"SELECT ut.id, ut.used, ut.expires_at FROM user_tokens ut JOIN users u ON ut.user_id = u.id WHERE u.email = ? and ut.type = 'reset' AND ut.token = ?",
		[decoded.email, token]
	);

	if (!records.length) throw new Error("Invalid Token");
	if (user.reset_token !== token) throw new Error("Invalid or already used token");
	if (new Date() > new Date(user.reset_token_expiry)) throw new Error("Reset Link has expired.");

	await db.query("UPDATE user_tokens set used = 1 WHERE id = ?", [records[0].id]);

	const hashed = await bcrypt.hash(newPassword, 10);
	await db.query(
		"UPDATE users SET password = ? WHERE email = ?",
		[hashed, decoded.email]
	);

	return { status: "success", message: "Password Reset Sucessfully!"}
};

export const getUserID = async (id) => {
	const [records] = await db.query(
		"SELECT `id`, `username`, `role` FROM `users` WHERE `id` = ?",
		[id]);

	if(!records.length){
		throw new Error("User not found");
	}

	return records[0];
};