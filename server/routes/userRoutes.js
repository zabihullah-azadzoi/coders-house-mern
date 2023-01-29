const express = require("express");

const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { getUser } = require("../controllers/userControllers");

router.get("/api/user/:id", authMiddleware, getUser);

module.exports = router;
