const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  image: { type: String },
  phone: { type: String, require: true },
  isActivated: { type: Boolean, required: false, default: false },
});

module.exports = mongoose.model("User", userSchema);
