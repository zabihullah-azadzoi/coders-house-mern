const Jimp = require("jimp");
const path = require("path");

exports.imageConverter = (image) => {
  const imageName = `${Date.now()}-${Math.round(Math.random() * "1e9")}.png`;
  Jimp.read(image)
    .then((image) => {
      return image
        .resize(60, Jimp.AUTO)
        .quality(100)
        .write(path.resolve(__dirname, `../storage/${imageName}`));
    })
    .catch((e) => {
      throw new Error("Something went wrong!");
    });

  return imageName;
};
