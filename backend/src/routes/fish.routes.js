import { Router } from "express";
import upload from "../middleware/upload.middleware.js";
import { analyzeFish } from "../controllers/fish.controller.js";

const router = Router();

router.post("/fish/analyze", upload.single("image"), analyzeFish);

export default router;