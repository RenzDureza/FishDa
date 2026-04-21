import db from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/mailer.js";

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
		throw new Error("Email does not exist");
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
