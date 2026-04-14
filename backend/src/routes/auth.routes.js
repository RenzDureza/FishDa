import { Router } from "express";
import { register, login } from "../controllers/auth.controllers.js";
import { showUsers } from "../controllers/admin.controllers.js";
import { auth, requireRole } from "../utils/auth.js";
import { verify } from "jsonwebtoken";

const router = Router();

router.post("/register", register);
router.get("/admin", auth, requireRole("admin"), showUsers);
router.post("/login", login);
router.get("/verify-email", verifyEmai);

export default router;
