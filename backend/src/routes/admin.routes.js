import { Router } from "express";
import { showUsers, searchUsers } from "../controllers/admin.controllers.js";
import { auth, requireRole } from "../utils/auth.js";

const router = Router();

router.get("/admin", auth, requireRole("admin"), showUsers);
router.get("/admin/search", auth, requireRole("admin"), searchUsers);

export default router;
