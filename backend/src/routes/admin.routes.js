import { Router } from "express";
import { showUsers, searchUsers, deleteUser } from "../controllers/admin.controllers.js";
import { auth, requireRole } from "../utils/auth.js";

const router = Router();

router.get("/admin", auth, requireRole("admin"), showUsers);
router.get("/admin/search", auth, requireRole("admin"), searchUsers);
router.delete("/admin/delete/:id", auth, requireRole("admin"), deleteUser);

export default router;
