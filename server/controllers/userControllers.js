const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId)
      return res.status(400).json({ message: "User id is required!" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "No record found for this ID!" });

    res.json({ user });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
