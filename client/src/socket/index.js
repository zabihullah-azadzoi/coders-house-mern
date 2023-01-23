import io from "socket.io-client";

const socketConnection = () => {
  const options = {
    "force new connection": true,
    timeout: 20000,
    reconnectionAttempt: "Infinity",
    transports: ["websocket"],
  };

  return io("http://localhost:5000", options);
};

export default socketConnection;
