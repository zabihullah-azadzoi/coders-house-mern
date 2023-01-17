const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    image: {
      type: String,
      get: formatImageName,
    },
    phone: { type: String, require: true },
    isActivated: { type: Boolean, required: false, default: false },
  },
  { timestamps: true, toJSON: { getters: true } }
);

function formatImageName(image) {
  return `http://localhost:5000/storage/${image}`;
}

module.exports = mongoose.model("User", userSchema);
