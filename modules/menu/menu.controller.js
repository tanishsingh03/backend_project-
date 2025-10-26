// --------------------------
// FILE: modules/menu/menu.controller.js
// --------------------------
const prisma = require("../../lib/prisma");

async function getMenuForRestaurant(req, res) {
if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });
const { id } = req.params;
try {
const menu = await prisma.menuItem.findMany({ where: { restaurantId: parseInt(id) }, select: { id: true, name: true, price: true } });
res.json({ menu });
} catch (err) {
res.status(400).json({ message: err.message });
}
}

async function listRestaurants(req, res) {
if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });
try {
const restaurants = await prisma.restaurant.findMany({ select: { id: true, name: true, address: true } });
res.json({ restaurants });
} catch (err) {
res.status(400).json({ message: err.message });
}
}

module.exports = { getMenuForRestaurant, listRestaurants };