// --------------------------
// FILE: modules/restaurant/restaurant.controller.js
// --------------------------
const prisma = require("../../lib/prisma");

async function getRestaurantOrders(req, res) {
if (req.user.role !== "restaurant") return res.status(403).json({ message: "Forbidden" });
try {
const orders = await prisma.order.findMany({
where: { restaurantId: req.user.id },
include: { items: { include: { menuItem: true } }, user: true },
});
res.json({ orders });
} catch (err) {
res.status(400).json({ message: err.message });
}
}

async function addMenuItem(req, res) {
if (req.user.role !== "restaurant") return res.status(403).json({ message: "Forbidden" });
const { name, price } = req.body;
try {
const menuItem = await prisma.menuItem.create({ data: { name, price, restaurantId: req.user.id } });
res.json({ message: "Menu item added", menuItem });
} catch (err) {
res.status(400).json({ message: err.message });
}
}

module.exports = { getRestaurantOrders, addMenuItem };