// --------------------------
// FILE: modules/menu/menu.routes.js
// --------------------------
const express = require("express");
const router = express.Router();
const { getMenuForRestaurant, listRestaurants } = require("./menu.controller");
const { authenticate } = require("../auth/auth.middleware");

router.get("/restaurant/:id/menu", authenticate, getMenuForRestaurant);
router.get("/restaurants", authenticate, listRestaurants);

module.exports = router;
