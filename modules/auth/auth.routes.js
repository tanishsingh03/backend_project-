// --------------------------
// FILE: modules/auth/auth.routes.js
// --------------------------
const express = require("express");
//const prisma = require("../../lib/prisma");

const router = express.Router();
const { signup, login } = require("./auth.controller");
// const { PrismaClient } = require("./generated/prisma");
// const prisma = new PrismaClient();

router.post("/signup/:role", signup);
router.post("/login/:role", login);

module.exports = router;