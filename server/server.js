const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./DBConnection");

const authRouter = require("./routes/authRoutes");
const activateRouter = require("./routes/activateRoutes");

const app = express();

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "8mb" }));
app.use(express.static(path.join(__dirname, "storage")));

app.use(authRouter);
app.use(activateRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is connected on port: ${port}`);
});
