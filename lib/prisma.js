// --------------------------
// FILE: lib/prisma.js
// --------------------------
const { PrismaClient } = require('../generated/prisma');  // note the '../'
const prisma = new PrismaClient();

module.exports = prisma;