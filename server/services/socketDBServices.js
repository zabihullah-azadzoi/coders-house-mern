const Room = require("../models/Room");

exports.addSpeakerToDb = async (user) => {
  try {
    if (user._id === user.roomCreatorId) return;
    await Room.findByIdAndUpdate(user.roomId, {
      $addToSet: { speakers: user._id },
    });
  } catch (e) {
    console.log("add socket join to DB ERROR: ", e);
  }
};

exports.deleteUpdateRoom = async (user) => {
  try {
    if (!user) return;
    if (user._id === user.roomCreatorId) {
      await Room.findByIdAndDelete(user.roomId);
    } else {
      await Room.findByIdAndUpdate(user.roomId, {
        $pull: { speakers: user._id },
      });
    }
  } catch (e) {
    console.log("delete socket Room Error", e);
  }
};
