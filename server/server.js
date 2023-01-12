const express = require("express");
require("dotenv").config();
require("./DBConnection");

const authRouter = require("./routes/authRoutes");

const app = express();
app.use(express.json());

app.use(authRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is connected on port: ${port}`);
});
