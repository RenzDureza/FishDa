import { Router } from "express";
import { register, showUsers } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", register);
router.get("/admin", showUsers);

export default router;
