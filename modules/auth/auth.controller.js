// --------------------------
// FILE: modules/auth/auth.controller.js
// --------------------------
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../lib/prisma");
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

async function signup(req, res) {
const { role } = req.params; // "user" or "restaurant"
const { name, email, password, address, phone } = req.body;
if (!password) return res.status(400).json({ message: "Password is required" });
const hashedPassword = await bcrypt.hash(password, 10);
try {
let result;
if (role === "user") {
result = await prisma.user.create({ data: { name, email, password: hashedPassword, address, phone } });
} else if (role === "restaurant") {
result = await prisma.restaurant.create({ data: { name, email, password: hashedPassword, address, phone } });
} else {
return res.status(400).json({ message: "Invalid role" });
}
res.json({ message: "Signup successful", user: result });
} catch (err) {
res.status(400).json({ message: err.message });
}
}

async function login(req, res) {
const { role } = req.params;
const { email, password } = req.body;
try {
let user;
if (role === "user") {
user = await prisma.user.findUnique({ where: { email } });
} else if (role === "restaurant") {
user = await prisma.restaurant.findUnique({ where: { email } });
} else {
return res.status(400).json({ message: "Invalid role" });
}
if (!user) return res.status(400).json({ message: "User not found" });
const valid = await bcrypt.compare(password, user.password);
if (!valid) return res.status(400).json({ message: "Invalid password" });
const token = jwt.sign({ id: user.id, role }, JWT_SECRET, { expiresIn: "1d" });
res.json({ message: "Login successful", token });
} catch (err) {
res.status(400).json({ message: err.message });
}
}

module.exports = { signup, login };
