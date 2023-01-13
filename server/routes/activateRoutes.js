const express = require("express");
const router = express.Router();

const { activateUserHandler } = require("../controllers/activateControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/api/activate", authMiddleware, activateUserHandler);

module.exports = router;
