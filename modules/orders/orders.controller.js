// --------------------------
// FILE: modules/orders/orders.controller.js
// --------------------------
//const prisma = require("../../lib/prisma");
const { PrismaClient } = require("../auth/generated/prisma");
const prisma = new PrismaClient();

async function createOrder(req, res) {
if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });
const { restaurantId, items } = req.body;
try {
let totalPrice = 0;
for (let item of items) {
const menu = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
if (!menu) return res.status(400).json({ message: `Menu item not found: ${item.menuItemId}` });
if (menu.restaurantId !== restaurantId)
return res.status(400).json({ message: `Menu item ${menu.name} does not belong to this restaurant` });
totalPrice += menu.price * item.quantity;
}
const order = await prisma.order.create({
data: {
orderNumber: `ORD-${Date.now()}`,
userId: req.user.id,
restaurantId,
totalPrice,
items: { create: items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })) },
},
include: { items: { include: { menuItem: true } } },
});
res.json({ message: "Order created", order });
} catch (err) {
res.status(400).json({ message: err.message });
}
}

async function getUserOrders(req, res) {
const { id } = req.params;
try {
const orders = await prisma.order.findMany({
where: { userId: parseInt(id) },
include: { items: { include: { menuItem: true } }, restaurant: true },
});
res.json({ orders });
} catch (err) {
res.status(400).json({ message: err.message });
}
}

module.exports = { createOrder, getUserOrders };