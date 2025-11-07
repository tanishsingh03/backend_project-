// --------------------------
// FILE: server.js
// --------------------------
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();



const authRoutes = require("./modules/auth/auth.routes");
const ordersRoutes = require("./modules/orders/orders.routes");
const restaurantRoutes = require("./modules/restaurant/restaurant.routes");
const menuRoutes = require("./modules/menu/menu.routes");

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("Food Delivery API is running 🚀"));

// mount modular routes
app.use("/api", authRoutes);
app.use("/api", ordersRoutes);
app.use("/api", restaurantRoutes);
app.use("/api", menuRoutes);

const PORT = process.env.PORT || 6789;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;