const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tokenSchema = mongoose.Schema(
  {
    token: { type: String, required: true },
    userId: { type: ObjectId, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
