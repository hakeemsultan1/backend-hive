import { verifyToken } from "../helpers/jwt.js";

async function bearerAuth(req, res, next) {
    try {
        let headers = req.headers;
        if (!headers.authorization) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        let token = headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        let data = verifyToken(token);
        if (!data) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = data;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function adminAuth(req, res, next) {
    try {
        let user = req.user;
        if (user.role !== "admin") {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { bearerAuth, adminAuth };