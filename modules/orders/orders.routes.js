// --------------------------
// FILE: modules/orders/orders.routes.js
// --------------------------
const express = require("express");
const router = express.Router();
const { createOrder, getUserOrders } = require("./orders.controller");
const { authenticate } = require("../auth/auth.middleware");

router.post("/orders", authenticate, createOrder);
router.get("/user/:id/orders", authenticate, getUserOrders);

module.exports = router;
