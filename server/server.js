const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./DBConnection");

const ACTIONS = require("./actions");

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
const peerConnections = {};
io.on("connection", (socket) => {
  console.log("connection established", socket.id);

  // joining a room and creating new peer connection
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    peerConnections[socket.id] = user;

    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((client) => {
      io.to(client).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user: user,
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: client,
        createOffer: true,
        user: peerConnections[client],
      });
    });

    socket.join(roomId);
  });

  // handling relay ice event
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.RELAY_ICE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  // handling relay sdp (session description)
  socket.on(
    ACTIONS.RELAY_SESSION_DESCRIPTION,
    ({ peerId, sessionDescription }) => {
      io.to(peerId).emit(ACTIONS.RELAY_SESSION_DESCRIPTION, {
        peerId: socket.id,
        sessionDescription,
      });
    }
  );

  // leaving the room
  const handleLeave = ({ roomId }) => {
    const rooms = socket.rooms;

    Array.from(rooms).forEach((room) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(room));

      clients.forEach((client) => {
        io.to(client).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: peerConnections[socket.id]?._id,
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: client,
          userId: peerConnections[client]?._id,
        });
      });

      socket.leave(room);
    });

    delete peerConnections[socket.id];
  };

  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId));

    clients.forEach((client) => {
      io.to(client).emit(ACTIONS.MUTE, { userId });
    });
  });

  socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId));

    clients.forEach((client) => {
      io.to(client).emit(ACTIONS.UN_MUTE, { userId });
    });
  });

  socket.on(ACTIONS.LEAVE, handleLeave);
  socket.on("disconnecting", handleLeave);
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`server is connected on port: ${port}`);
});
