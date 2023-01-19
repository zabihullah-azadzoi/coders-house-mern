const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./DBConnection");

const authRouter = require("./routes/authRoutes");
const activateRouter = require("./routes/activateRoutes");
const roomRouter = require("./routes/roomRoutes");

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "8mb" }));
app.use("/storage", express.static(path.join(__dirname, "storage")));
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(authRouter);
app.use(activateRouter);
app.use(roomRouter);

// socket events
io.on("connection", (socket) => {
  console.log("connection established");

  socket.on("join", () => {
    console.log("connected from client side");
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`server is connected on port: ${port}`);
});
