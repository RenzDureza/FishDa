import * as fishService from "../services/fish.service.js";

export const analyzeFish = async (req, res) => {
    try {
        console.log("HEADERS:", req.headers);
        console.log("FILE:", req.files);
        console.log("BODY:", req.body);

        const fishImage = req.files?.fish_image?.[0];
        const gillImage = req.files?.gill_image?.[0];

        if (!fishImage) {
            return res.status(400).json({
                status: "error",
                message: "Fish image is required.",
            })
        }
        
        const result = await fishService.analyzeFish({fishImage, gillImage});

        if (!result.has_fish) {
            return res.status(400).json({
                status: "error",
                message: "No fish detected in image.",
            })
        }
        return res.status(200).json({
            status: "success",
            message: "Fish image analyzed successfully",
            data: result,
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            status: "error",
            message: err.message || "Failed to analyze fish image.",
        });
    }
};