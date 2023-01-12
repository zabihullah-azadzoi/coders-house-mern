const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("DB connected!");
  })
  .catch((e) => console.log("DB Connection Error --->", e.message));
