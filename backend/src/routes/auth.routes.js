import { Router } from "express";
import { register, showUsers, login } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", register);
router.get("/admin", showUsers);
router.post("/login", login);

export default router;
