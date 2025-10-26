// --------------------------
// FILE: modules/auth/auth.middleware.js
// --------------------------
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const authenticate = (req, res, next) => {
const authHeader = req.headers["authorization"];
if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
try {
const token = authHeader.split(" ")[1];
const decoded = jwt.verify(token, JWT_SECRET);
req.user = decoded;
next();
} catch (err) {
return res.status(401).json({ message: "Invalid Token" });
}
};

module.exports = { authenticate };