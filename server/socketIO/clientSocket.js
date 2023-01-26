const ACTIONS = require("../actions");
const Room = require("../models/Room");

const peerConnections = {};

module.exports = (io, socket) => {
  // joining a room and creating new peer connection
  const joinClientHandler = ({ roomId, user }) => {
    peerConnections[socket.id] = user;

    console.log("peerConnections", peerConnections);

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
  };

  // leaving the room
  const handleLeave = async () => {
    const user = peerConnections[socket.id];
    console.log("socket user", user);

    const rooms = socket.rooms;
    Array.from(rooms).forEach((room) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
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

    // updating the speakers array in DB while user is leaving
    if (!user) return;
    try {
      if (user._id === user.roomCreatorId) {
        await Room.findByIdAndDelete(user.roomId);
      } else {
        await Room.findByIdAndUpdate(user.roomId, {
          $pull: { speakers: user._id },
        });
      }
    } catch (error) {
      console.log("delete socket Room Error", error);
    }

    delete peerConnections[socket.id];
  };

  const muteClientHandler = ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients?.forEach((client) => {
      io.to(client).emit(ACTIONS.MUTE, { userId });
    });
  };

  const unMuteClientHandler = ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients?.forEach((client) => {
      io.to(client).emit(ACTIONS.UN_MUTE, { userId });
    });
  };

  const handRaiseHandler = ({ client, roomId, roomCreator }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    const adminSocket = clients.find(
      (cli) => peerConnections[cli]._id === roomCreator
    );
    if (adminSocket) {
      io.to(adminSocket).emit(ACTIONS.HAND_RAISE, {
        client,
        peerId: socket.id,
      });
    }
  };

  const handRaiseConfirmHandler = ({ roomId, allClients, peerId, client }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    peerConnections[peerId] = client;

    clients?.forEach((client) => {
      io.to(client).emit(ACTIONS.HAND_RAISE_CONFIRM, { allClients });
    });
  };

  // socket.on("end-room", ({ room, user }) => {
  //   const clients = Array.from(io.sockets.adapter.rooms.get(room._id) || []);

  //   clients.forEach((client) => {
  //     if (client === socket.id) {
  //       socket.emit(socket.id).emit("end-room", { peerId: client });
  //       socket.leave(room._id);
  //     } else {
  //       io.to(client).emit("end-room", { peerId: client });
  //       client.leave(room._id);
  //     }
  //     delete peerConnections[client];
  //   });
  // });

  // socket.on("disconnect", () => {
  //   socket.emit("disconnected", { socketId: socket.id });
  // });

  socket.on(ACTIONS.HAND_RAISE, handRaiseHandler);
  socket.on(ACTIONS.HAND_RAISE_CONFIRM, handRaiseConfirmHandler);
  socket.on(ACTIONS.MUTE, muteClientHandler);
  socket.on(ACTIONS.UN_MUTE, unMuteClientHandler);
  socket.on(ACTIONS.JOIN, joinClientHandler);
  socket.on(ACTIONS.LEAVE, handleLeave);
  socket.on("disconnecting", handleLeave);
};
