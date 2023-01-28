const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String },
    image: {
      type: String,
      get: formatImageName,
    },
    bio: { type: String },
    username: { type: String },
    phone: { type: String, require: true },
    isActivated: { type: Boolean, required: false, default: false },
  },
  { timestamps: true, toJSON: { getters: true } }
);

function formatImageName(image) {
  if (image) {
    return `${process.env.BASE_URL}/storage/${image}`;
  }
}

module.exports = mongoose.model("User", userSchema);
