const User = require("../models/User");
const {
  imageConverter,
  formatUserData,
} = require("../services/profileServices.js");

exports.activateUserHandler = async (req, res) => {
  try {
    const { name, image, bio, username } = req.body;
    if (!name || !bio || !username) {
      return res.status(400).json({ message: "all fields are required!" });
    }

    let imageName = "";
    if (image) {
      const avatar = Buffer.from(
        image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      imageName = imageConverter(avatar);
    }

    const user = await User.findById(req.user._id);
    user.isActivated = true;
    user.name = name;
    user.image = imageName !== "" ? imageName : undefined;
    user.bio = bio;
    user.username = username;
    await user.save();
    res.json({
      user: formatUserData(user),
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
