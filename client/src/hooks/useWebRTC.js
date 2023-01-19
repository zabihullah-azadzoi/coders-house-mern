import { useState, useRef, useEffect, useCallback } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import socketConnection from "../socket/index";

export const useWebRTC = (user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElementsRef = useRef({});
  const connectionsRef = useRef({});
  const userMediaStream = useRef();
  const socketRef = useRef();

  const provideRef = (instance, clientId) => {
    audioElementsRef.current[clientId] = instance;
  };

  const addNewClient = useCallback(
    (client, cb) => {
      const existingClient = clients.find((cli) => cli._id === client._id);
      if (existingClient === undefined) {
        setClients((prevState) => [...prevState, client], cb);
      }
    },
    [clients, setClients]
  );

  useEffect(() => {
    const getMediaStream = async () => {
      userMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };
    getMediaStream()
      .then(() => {
        addNewClient(user, () => {
          const localElement = audioElementsRef.current[user._id];
          if (localElement) {
            localElement.volume = 0;
            localElement.srcObject = userMediaStream.current;
          }
          socketRef.current = socketConnection();
          socketRef.current.emit("join");
        });
      })
      .catch((e) => console.log(e));
  }, [setClients, user, addNewClient]);

  return { clients, provideRef };
};
