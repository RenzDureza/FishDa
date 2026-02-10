import { Router } from "express";
import { register, login } from "../controllers/auth.controllers.js";
import { showUsers } from "../controllers/admin.controllers.js";

const router = Router();

router.post("/register", register);
router.get("/admin", showUsers);
router.post("/login", login);

export default router;
