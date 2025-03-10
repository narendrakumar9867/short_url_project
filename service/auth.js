const jwt = require("jsonwebtoken");
const secret = "Narendra$123@$";

function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        secret
    );
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error("JWT Error:", error.message);
        return null;
    }
}

function authMiddleware(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const user = getUser(token);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = user; // Attach user to the request
    next();
}

module.exports = {
    setUser,
    getUser,
    authMiddleware,
};
