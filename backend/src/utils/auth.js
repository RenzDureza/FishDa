import jwt from "jsonwebtoken";

const MAX_SESSION_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const auth = (req, res, next) => {
    const header = req.headers.authorization;

    if(!header?.startsWith("Bearer ")){
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = header.split(" ")[1];

    try{
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        
        if(Date.now() - req.user.session_start > MAX_SESSION_AGE){
            return res.status(401).json({
                message: "Session expired"
            });
        }
        next();
    } catch(err) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export const requireRole = (role) => (req, res, next) => {
    if(req.user?.role !== role){
        return res.status(403).json({
            message: "Forbidden"
        });
    }
    next();
}