import React from "react";
import { useSelector } from "react-redux";
import { useWebRTC } from "../../hooks/useWebRTC";

import { useParams } from "react-router-dom";

const Room = () => {
  const { roomId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { clients, provideRef } = useWebRTC(user, roomId);

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
