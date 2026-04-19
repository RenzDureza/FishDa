import multer from "multer";

const errorMiddleware = (err, req, res, next) => {
    if (!err) {
        return next();
    }

    if (err instanceof multer.MulterError) {
        let message = err.message;

        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File is too large. Maximum size is 5MB.";
        }

        return res.status(400).json({
            status: "error",
            message,
            code: err.code,
        });
    }

    return res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal server error.",
        code: err.code || "INTERNAL_SERVER_ERROR",
    });
};

export default errorMiddleware;
