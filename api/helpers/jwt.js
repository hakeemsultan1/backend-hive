import jwt from "jsonwebtoken";

function generateToken(data) {
    const token = jwt.sign(data, process.env.SECRET, {
        expiresIn: "3d",
    });
    return token;
}

function verifyToken(token) {
    const data = jwt.verify(token, process.env.SECRET);
    return data;
}

export { generateToken, verifyToken };