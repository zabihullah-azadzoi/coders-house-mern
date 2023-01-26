const router = require("express").Router();

const { authMiddleware } = require("../middlewares/authMiddleware");

const {
  createRoom,
  getAllRooms,
  getRoom,
  deleteRoom,
  roomSpeakersHandler,
} = require("../controllers/roomControllers");

router.post("/api/rooms", authMiddleware, createRoom);
router.get("/api/rooms", authMiddleware, getAllRooms);
router.get("/api/rooms/:roomId", authMiddleware, getRoom);

module.exports = router;
