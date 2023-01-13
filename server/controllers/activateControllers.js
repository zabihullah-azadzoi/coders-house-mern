const User = require("../models/User");
const { imageConverter } = require("../services/profileServices.js");

exports.activateUserHandler = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({ message: "all fields are required!" });
    }

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
      user: {
        name: user.name,
        phone: user.phone,
        avatar: `${req.protocol}://${req.get("host")}/storage/${imageName}`,
        _id: user._id,
        isActivated: user.isActivated,
      },
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
