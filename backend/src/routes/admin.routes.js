import { Router } from "express";
import { showUsers } from "../controllers/admin.controllers.js";

const router = Router();

router.get("/admin", showUsers);

export default router;
