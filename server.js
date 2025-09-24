const express = require("express");
//const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("./generated/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
dotenv.config();
const prisma = new PrismaClient();
const app = express();

//app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("Food Delivery API is running 🚀"));

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// ----------------------
// Middleware for Auth
// ----------------------
const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

// ----------------------
// Signup Route
// ----------------------
app.post("/signup/:role", async (req, res) => {
  const { role } = req.params; // "user" or "restaurant"
  const { name, email, password, address, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let result;
    if (role === "user") {
      result = await prisma.user.create({
        data: { name, email, password: hashedPassword, address, phone },
      });
    } else if (role === "restaurant") {
      result = await prisma.restaurant.create({
        data: { name, email, password: hashedPassword, address, phone },
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.json({ message: "Signup successful", user: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ----------------------
// Login Route
// ----------------------
app.post("/login/:role", async (req, res) => {
  const { role } = req.params; // "user" or "restaurant"
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
});

// ----------------------
// Create Order (Customer only)
// ----------------------
// app.post("/orders", authenticate, async (req, res) => {
//   if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });

//   const { restaurantId, items } = req.body; // items = [{ menuItemId, quantity }]
//   try {
//     // calculate total
//     let totalPrice = 0;
//     for (let item of items) {
//       const menu = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
//       if (!menu) return res.status(400).json({ message: "Menu item not found" });
//       totalPrice += menu.price * item.quantity;
//     }

//     const order = await prisma.order.create({
//       data: {
//         orderNumber: `ORD-${Date.now()}`,
//         userId: req.user.id,
//         restaurantId,
//         totalPrice,
//         items: {
//           create: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
//         },
//       },
//       include: { items: true },
//     });

//     res.json({ message: "Order created", order });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
app.post("/orders", authenticate, async (req, res) => {
  if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });

  const { restaurantId, items } = req.body; // items = [{ menuItemId, quantity }]
  try {
    let totalPrice = 0;

    // Validate menu items belong to the restaurant
    for (let item of items) {
      const menu = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!menu) return res.status(400).json({ message: `Menu item not found: ${item.menuItemId}` });
      if (menu.restaurantId !== restaurantId)
        return res.status(400).json({ message: `Menu item ${menu.name} does not belong to this restaurant` });
      totalPrice += menu.price * item.quantity;
    }

    // Create order
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
});


// ----------------------
// Get Orders for Restaurant
// ----------------------
app.get("/restaurant/orders", authenticate, async (req, res) => {
  if (req.user.role !== "restaurant") return res.status(403).json({ message: "Forbidden" });

  const orders = await prisma.order.findMany({
    where: { restaurantId: req.user.id },
    include: { items: { include: { menuItem: true } }, user: true },
  });

  res.json({ orders });
});

// ----------------------
// Get Orders for Customer
// ----------------------
// app.get("/user/orders", authenticate, async (req, res) => {
//   if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });

//   const orders = await prisma.order.findMany({
//     where: { userId: req.user.id },
//     include: { items: { include: { menuItem: true } }, restaurant: true },
//   });

//   res.json({ orders });
// });
app.get("/user/:id/orders", authenticate, async (req, res) => {
  const { id } = req.params;

  // Only admin or restaurant can access (optional: add role check)
  // if (req.user.role !== "admin" && req.user.role !== "restaurant") return res.status(403).json({ message: "Forbidden" });

  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(id) },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });

    res.json({ orders });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Create Menu Item (Restaurant only)
app.post("/restaurant/menu", authenticate, async (req, res) => {
  if (req.user.role !== "restaurant") return res.status(403).json({ message: "Forbidden" });

  const { name, price } = req.body;

  try {
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        price,
        restaurantId: req.user.id, // restaurant adds to their own menu
      },
    });

    res.json({ message: "Menu item added", menuItem });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Get menu for a specific restaurant
app.get("/restaurant/:id/menu", authenticate, async (req, res) => {
  if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });

  const { id } = req.params;

  try {
    const menu = await prisma.menuItem.findMany({
      where: { restaurantId: parseInt(id) },
      select: { id: true, name: true, price: true }
    });

    res.json({ menu });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all restaurants (Customer view)
app.get("/restaurants", authenticate, async (req, res) => {
  if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });

  try {
    const restaurants = await prisma.restaurant.findMany({
      select: { id: true, name: true, address: true }
    });
    res.json({ restaurants });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


const PORT = process.env.PORT || 6789;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
