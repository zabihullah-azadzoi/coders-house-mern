const ACTIONS = require("../actions");

const peerConnections = {};

module.exports = (io, socket) => {
  // joining a room and creating new peer connection
  const joinClientHandler = ({ roomId, user }) => {
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
  };

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

  const muteClientHandler = ({ roomId, userId }) => {
    const clients = Array.from(io?.sockets.adapter.rooms.get(roomId));

    clients?.forEach((client) => {
      io.to(client).emit(ACTIONS.MUTE, { userId });
    });
  };

  const unMuteClientHandler = ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId));

    clients?.forEach((client) => {
      io.to(client).emit(ACTIONS.UN_MUTE, { userId });
    });
  };

  socket.on("hand-raised", ({ client, roomId, roomCreator }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId));
    const adminSocket = clients.find(
      (cli) => peerConnections[cli]._id === roomCreator
    );
    if (adminSocket) {
      io.to(adminSocket).emit("hand-raised", { client, peerId: socket.id });
    }
  });

  socket.on(
    "hand-raise-confirmed",
    ({ roomId, allClients, peerId, client }) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId));
      peerConnections[peerId] = client;

      console.log("peerConnection", peerConnections[peerId]);
      console.log("peerId", peerId);
      console.log("client", client);

      clients?.forEach((client) => {
        io.to(client).emit("hand-raise-confirmed", { allClients });
      });
    }
  );

  console.log("peer connections", peerConnections);

  socket.on(ACTIONS.MUTE, muteClientHandler);
  socket.on(ACTIONS.UN_MUTE, unMuteClientHandler);
  socket.on(ACTIONS.JOIN, joinClientHandler);
  socket.on(ACTIONS.LEAVE, handleLeave);
  socket.on("disconnecting", handleLeave);
};
