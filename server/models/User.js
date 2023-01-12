const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  phone: { type: String, require: true },
  isActivated: { type: Boolean, required: false, default: false },
});

module.exports = mongoose.model("User", userSchema);
