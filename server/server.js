const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const socketio = require("socket.io");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./DBConnection");

const authRouter = require("./routes/authRoutes");
const activateRouter = require("./routes/activateRoutes");
const roomRouter = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");

const webRTCSocket = require("./socketIO/webRTCSocket");
const clientSocket = require("./socketIO/clientSocket");

//handling uncaught exceptions (Synchronous)
process.on("uncaughtException", (error) => {
  console.log(error.name, error);
  console.log("shutting down the server...!");
  process.exit(1); //shutting down the application
});

const app = express();
const server = http.createServer(app);

app.use(morgan("dev"));
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
app.use(userRoutes);

// socket events
io.on("connection", (socket) => {
  console.log("connection established", socket.id);

  webRTCSocket(io, socket);
  clientSocket(io, socket);
});

const port = process.env.PORT || 5000;
const serverConnection = server.listen(port, () => {
  console.log(`server is connected on port: ${port}`);
});

//handling unhandled promise (Asynchronous) rejections
process.on("unhandledRejection", (error) => {
  console.log(error.name, error);
  console.log("shutting down the server...!");
  serverConnection.close(() => {
    //closing the server
    process.exit(1); //shutting down the application
  });
});
