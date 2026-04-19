import * as fishService from "../services/fish.service.js";

export const analyzeFish = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No image file uploaded.",
            })
        }
        
        const result = await fishService.analyzeFish(req.file);

        return res.status(200).json({
            status: "success",
            message: "Fish image analyzed successfully",
            data: result,
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            status: "error",
            message: err.message || "Failed to analyze fish image.",
        });
    }
};