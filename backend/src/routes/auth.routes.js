import { Router } from "express";
import { register, login, verifyEmail, verifyToken } from "../controllers/auth.controllers.js";
import { auth } from "../utils/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/verify-token", auth, verifyToken);

export default router;
