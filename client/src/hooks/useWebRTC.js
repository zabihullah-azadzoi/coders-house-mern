import { useState, useRef, useEffect, useCallback } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import socketConnection from "../socket/index";
import ACTIONS from "../actions";
import freeice from "freeice";

export const useWebRTC = (user, roomId) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElementsRef = useRef({});
  const connectionsRef = useRef({});
  const userMediaStream = useRef();
  const socketRef = useRef();
  const clientsRef = useRef([]);

  const provideRef = (instance, clientId) => {
    audioElementsRef.current[clientId] = instance;
  };

  useEffect(() => {
    socketRef.current = socketConnection();
  }, []);

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

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
        addNewClient({ ...user, isMute: true }, () => {
          const localElement = audioElementsRef.current[user._id];
          if (localElement) {
            localElement.volume = 0;
            localElement.srcObject = userMediaStream.current;
          }
          socketRef.current.emit(ACTIONS.JOIN, { roomId, user });
        });
      })
      .catch((e) => console.log(e));

    return () => {
      // Leaving the room
      // userMediaStream.current.getTracks().forEach((track) => {
      //   track.stop();
      // });
      // socketRef.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, [setClients, user, addNewClient, roomId]);

  // adding new peer
  useEffect(() => {
    const addNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      // check if peer already exist!
      if (peerId in connectionsRef.current) return;

      connectionsRef.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      // handling new ice candidate
      connectionsRef.current[peerId].onicecandidate = (e) => {
        socketRef.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: e.candidate,
        });
      };

      // handling on track on current peer connection
      connectionsRef.current[peerId].ontrack = ({
        streams: [remoteStream],
      }) => {
        addNewClient({ ...remoteUser, isMute: true }, () => {
          if (audioElementsRef.current[remoteUser._id]) {
            audioElementsRef.current[remoteUser._id].volume = 0;
            audioElementsRef.current[remoteUser._id].srcObject = remoteStream;
          } else {
            // rendering all clients might get a bit longer that's why we are using interval to check every second if clients list is updated and when it's updated and audio element is available than we are clearing the interval again.
            let settled = true;
            const interval = setInterval(() => {
              if (audioElementsRef.current[remoteUser._id]) {
                audioElementsRef.current[remoteUser._id].volume = 0;
                audioElementsRef.current[remoteUser._id].srcObject =
                  remoteStream;

                settled = false;
              }
            }, 300);
            if (!settled) clearInterval(interval);
          }
        });
      };

      // adding current's user or local tracks to remote connection
      userMediaStream.current.getTracks().forEach((track) => {
        connectionsRef.current[peerId].addTrack(track, userMediaStream.current);
      });

      // create offer
      if (createOffer) {
        const offer = await connectionsRef.current[peerId].createOffer();
        await connectionsRef.current[peerId].setLocalDescription(offer);

        socketRef.current.emit(ACTIONS.RELAY_SESSION_DESCRIPTION, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    socketRef.current.on(ACTIONS.ADD_PEER, addNewPeer);

    return () => socketRef.current.off(ACTIONS.ADD_PEER);
  }, []);

  // handling relay ice event
  useEffect(() => {
    socketRef.current.on(
      ACTIONS.RELAY_ICE,
      async ({ peerId, icecandidate }) => {
        if (icecandidate) {
          await connectionsRef.current[peerId].addIceCandidate(icecandidate);
        }
      }
    );

    return () => {
      socketRef.current.off(ACTIONS.RELAY_ICE);
    };
  }, []);

  // handling relay session description
  useEffect(() => {
    const handleSessionDescription = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      await connectionsRef.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );

      // if session description type is offer than create an answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connectionsRef.current[peerId];
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);

        socketRef.current.emit(ACTIONS.RELAY_SESSION_DESCRIPTION, {
          peerId,
          sessionDescription: answer,
        });
      }
    };

    socketRef.current.on(
      ACTIONS.RELAY_SESSION_DESCRIPTION,
      handleSessionDescription
    );

    return () => {
      socketRef.current.off(ACTIONS.RELAY_SESSION_DESCRIPTION);
    };
  }, []);

  // handling remove peer
  useEffect(() => {
    const handleRemovePeer = async ({ peerId, userId }) => {
      if (connectionsRef.current[peerId]) {
        connectionsRef.current[peerId].close();
      }

      delete connectionsRef.current[peerId];
      delete audioElementsRef.current[peerId];

      setClients((prevState) => {
        return prevState.filter((client) => client._id !== userId);
      });
    };

    socketRef.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socketRef.current.off(ACTIONS.REMOVE_PEER);
    };
  }, [setClients]);

  //mute/unmute events
  useEffect(() => {
    socketRef.current.on(ACTIONS.MUTE, ({ userId }) => {
      setMute(true, userId);
    });

    socketRef.current.on(ACTIONS.UN_MUTE, ({ userId }) => {
      setMute(false, userId);
    });

    const setMute = (mute, userId) => {
      const remoteAudio = audioElementsRef.current[userId];
      if (mute) {
        remoteAudio.volume = 0;
      } else {
        remoteAudio.volume = 1;
      }
      const clientIndex = clientsRef.current
        .map((client) => client._id)
        .indexOf(userId);

      const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
      if (clientIndex > -1) {
        connectedClients[clientIndex].isMute = mute;

        setClients(connectedClients);
      }
    };

    return () => {
      socketRef.current.off(ACTIONS.MUTE);
      socketRef.current.off(ACTIONS.UN_MUTE);
    };
  }, [setClients]);

  // mute status handling
  const muteStatusHandler = useCallback(
    (mute, userId) => {
      let settled = false;
      const interval = setInterval(() => {
        if (userMediaStream.current) {
          userMediaStream.current.getTracks()[0].enabled = !mute;

          if (mute) {
            socketRef.current.emit(ACTIONS.MUTE, { roomId, userId });
          } else {
            socketRef.current.emit(ACTIONS.UN_MUTE, { roomId, userId });
          }

          settled = true;
        }

        if (settled) {
          clearInterval(interval);
        }
      }, 200);
    },
    [roomId]
  );

  return {
    clients,
    provideRef,
    muteStatusHandler,
  };
};
