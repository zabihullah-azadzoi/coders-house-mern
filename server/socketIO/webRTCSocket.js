const ACTIONS = require("../actions");

module.exports = (io, socket) => {
  // handling relay ice event
  const relayIceHandler = ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.RELAY_ICE, {
      peerId: socket.id,
      icecandidate,
    });
  };

  // handling relay sdp (session description)
  const relaySDHandler = ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.RELAY_SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  };
  socket.on(ACTIONS.RELAY_ICE, relayIceHandler);

  socket.on(ACTIONS.RELAY_SESSION_DESCRIPTION, relaySDHandler);
};
