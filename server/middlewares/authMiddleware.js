const { verifyJWT } = require("../services/authServices");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  try {
    const { refreshToken, accessToken } = req.cookies;
    if (!refreshToken || !accessToken) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    const data = await verifyJWT(accessToken);

    if (!data || !data._id) {
      return res.status(401).json({ message: "unAuthorized" });
    }

    const user = await User.findById(data._id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User doesn't exist in our system!" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
