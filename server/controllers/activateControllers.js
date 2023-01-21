const User = require("../models/User");
const {
  imageConverter,
  formatUserData,
} = require("../services/profileServices.js");

exports.activateUserHandler = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required!" });
    }

    if (image) {
      const avatar = Buffer.from(
        image.replace("data:image/jpeg;base64,", ""),
        "base64"
      );

      const imageName = imageConverter(avatar);

      const user = await User.findById(req.user._id);
      user.isActivated = true;
      user.name = name;
      user.image = imageName;
      await user.save();
      res.json({
        user: formatUserData(req, user),
      });
    } else {
      const user = await User.findById(req.user._id);
      user.isActivated = true;
      user.name = name;
      await user.save();
      res.json({
        user: formatUserData(req, user),
      });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
