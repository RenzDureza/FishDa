import { Router } from "express";
import upload from "../middleware/upload.middleware.js";
import { analyzeFish } from "../controllers/fish.controller.js";

const router = Router();

router.post("/analyze", upload.fields([{name: "fish_image", maxCount: 1}, {name: "gill_image", maxCount: 1}]), analyzeFish);

export default router;