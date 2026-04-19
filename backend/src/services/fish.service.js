import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const ML_SERVICE_URL = "http://localhost:8000/predict";

export const analyzeFish = async (file) => {
    const form_data = new FormData();
    
    form_data.append("file", fs.createReadStream(file.path));

    try {
        const response = await axios.post(ML_SERVICE_URL, form_data, {
            headers: form_data.getHeaders(),
            timeout: 15000,
        });

        return {
            has_fish: response.data.has_fish,
            species: response.data.species,
            eye_score: response.data.eye_score,
            body_score: response.data.body_score,
            tail_score: response.data.tail_score,
            overall_score: response.data.rule_score,
            ml_score: response.data.ml_score,
            quality: response.data.quality,
        };
    } catch (err) {
        if (err.code === "ECONNREFUSED") {
            const error = new Error ("Python ML service is down or unreachable.");
            error.status = 503;
            throw error;
        }

        if (err.code === "ECONNABORTED") {
            const error = new Error("Python ML service timed out.");
            error.status = 504;
            throw error;
        }
        
        if (err.response) {
            const error = new Error(err.response.data.detail || "ML service returned an error.");
            error.status = err.response.status;
            throw error;
        }

        const error = new Error ("Unknown error occured.");
        error.status = 500;
        throw error;
    } finally {
        try {
            if (file?.path && fs.existsSync(file.path)) {
                await fs.promises.unlink(file.path);
            }
        } catch (e) {
            console.error("Failed to delete file: ", e);
        }
    }
};