import multer from "multer";
import path from "path";
import fs from "fs";

const upload_folder = "src/uploads";

//Create upload folder
if (!fs.existsSync(upload_folder)) {
    fs.mkdirSync(upload_folder, {recursive: true});
}

//Temporarily save file to uploads/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, upload_folder);
    },
    filename: (req, file, cb) => {
        const file_extension = path.extname(file.originalname);
        const file_name = `fish-${Date.now()}${file_extension}`;
        cb(null, file_name);
    }
})

const allowed_mime = ["image/jpeg", "image/jpg", "image/pjpeg", "image/png"];
const allowed_extensions = [".jpeg", ".jpg", ".png"];

//File extensions filter
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype?.toLowerCase();
    const has_valid_mime = allowed_mime.includes(mimetype);
    const has_valid_extension = allowed_extensions.includes(ext);

    if (has_valid_mime || has_valid_extension){
        cb(null, true);
    } else {
        const error = new Error("Invalid file format. Only JPG, JPEG, and PNG types are allowed.");
        error.status = 400;
        error.code = "INVALID_FILE_FORMAT";
        error.details = {
            originalname: file.originalname,
            mimetype: file.mimetype,
        };
        cb(error);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;
