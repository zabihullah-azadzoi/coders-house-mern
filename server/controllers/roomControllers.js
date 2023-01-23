const { json } = require("express");
const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
  try {
    const { title, type, creator } = req.body;

    if (!title || !type || !creator)
      return res.status(400).json({ message: "All fields are required!" });

    const newRoom = await Room({
      title,
      type,
      creator,
      speakers: [creator],
    }).save();

    res.json(newRoom);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const allRooms = await Room.find({}).populate(["creator", "speakers"]);

    res.json(allRooms);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    if (!roomId)
      return res.status(400).json({ message: "Room ID is required!" });

    const room = await Room.findById(roomId).populate(["creator", "speakers"]);

    res.json(room);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.roomSpeakersHandler = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const speakerId = req.body.speakerId;
    const flag = req.body.flag;
    let updatedRoom;

    console.log(roomId, speakerId);

    if (!roomId || !speakerId) {
      return res
        .status(400)
        .json({ message: "roomId & speakerId are required!" });
    }

    if (flag === "add") {
      updatedRoom = await Room.findByIdAndUpdate(
        roomId,
        { $addToSet: { speakers: speakerId } },
        { new: true }
      );
    } else if (flag === "remove") {
      updatedRoom = await Room.findOneAndUpdate(
        roomId,
        { $pull: { speakers: speakerId } },
        { new: true }
      );
    }

    res.json({ status: "Ok" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
