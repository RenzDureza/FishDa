import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

export const analyzeFish = async ({ fishImage, gillImage }) => {
    const form_data = new FormData();
    
    form_data.append("fish_image", fs.createReadStream(fishImage.path));

    if (gillImage){
        form_data.append("gill_image", fs.createReadStream(gillImage.path));
    }

    try {
        const response = await axios.post(ML_SERVICE_URL, form_data, {
            headers: form_data.getHeaders(),
            timeout: 15000,
        });

        return {
            has_fish: response.data.has_fish,
            species: response.data.species,
            eye_score: response.data.features.eye_score,
            gill_score: response.data.features.gill_score,
            body_score: response.data.features.body_score,
            tail_score: response.data.features.tail_score,
            rule_score: response.data.rule_score,
            ml_score: response.data.ml_score,
            final_score: response.data.final_score,
            quality: response.data.quality,

            // species: response.data.species,
            // features: response.data.features,
            // rule_score: response.data.rule_score,
            // ml_score: response.data.ml_score,
            // quality: response.data.quality,
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
        const files = [fishImage, gillImage];

        for (const file of files){
            try {
                if (file?.path && fs.existsSync(file.path)) {
                    await fs.promises.unlink(file.path);
                }
            } catch (e) {
                console.error("Failed to delete file: ", e);
            }
        } 
    }
};