import { Router } from "express";
import { register, login, verifyEmail } from "../controllers/auth.controllers.js";
import { showUsers } from "../controllers/admin.controllers.js";
import { auth, requireRole } from "../utils/auth.js";

const router = Router();

router.post("/register", register);
router.get("/admin", auth, requireRole("admin"), showUsers);
router.post("/login", login);
router.get("/verify-email", verifyEmail);

export default router;
