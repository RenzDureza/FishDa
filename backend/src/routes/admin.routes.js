import { Router } from "express";
import { showUsers } from "../controllers/admin.controllers.js";
import { auth, requireRole } from "../utils/auth.js";

const router = Router();

router.get("/admin", auth, requireRole("admin"), showUsers);

export default router;
