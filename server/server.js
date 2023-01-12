const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./DBConnection");

const authRouter = require("./routes/authRoutes");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

app.use(authRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is connected on port: ${port}`);
});
