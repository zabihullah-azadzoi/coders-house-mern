import React from "react";
import { useSelector } from "react-redux";
import { useWebRTC } from "../../hooks/useWebRTC";

const Room = () => {
  const user = useSelector((state) => state.auth.user);
  const { clients, provideRef } = useWebRTC(user);

  console.log(clients);

  return (
    <div>
      {clients.length > 0 &&
        clients.map((client) => {
          return (
            <div key={client._id}>
              <audio
                ref={(instance) => provideRef(instance, client._id)}
                controls
                autoPlay
              />
              <h6>{client.name}</h6>
            </div>
          );
        })}
    </div>
  );
};

export default Room;
