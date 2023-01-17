const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ["open", "social", "private"] },
    creator: { type: ObjectId, ref: "User" },
    speakers: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
