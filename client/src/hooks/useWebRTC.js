import { useRef, useEffect, useCallback } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import socketConnection from "../socket/index";
import { addSpeaker } from "../http/roomRequests";

import ACTIONS from "../actions";
import freeice from "freeice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useWebRTC = (user, roomId, roomCreator) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElementsRef = useRef({});
  const connectionsRef = useRef({});
  const userMediaStream = useRef();
  const socketRef = useRef();
  const clientsRef = useRef([]);

  const navigate = useNavigate();

  // new comment added to this list

  const socketErrorHandler = (err) => {
    console.log(err);
    toast.error("Couldn't connect to server, please try again later!");
    navigate("/rooms");
  };

  useEffect(() => {
    socketRef.current = socketConnection();

    //socket error handling
    socketRef.current.on("connect_error", (err) => socketErrorHandler(err));
    socketRef.current.on("connect_failed", (err) => socketErrorHandler(err));
  }, []);

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  const provideRef = (instance, clientId) => {
    audioElementsRef.current[clientId] = instance;
  };

  const raiseHandHandler = (client, roomId, roomCreator) => {
    socketRef.current.emit(ACTIONS.HAND_RAISE, { client, roomId, roomCreator });
  };

  const addNewClient = useCallback(
    (client, cb) => {
      const existingClient = clients.find((cli) => cli._id === client._id);

      if (existingClient === undefined) {
        setClients((prevState) => [...prevState, client], cb);

        if (client._id !== user._id) {
          addSpeaker(roomId, client._id, "add")
            .then((res) => {})
            .catch((e) =>
              toast.error(
                e.response ? e.response.data.message : "something went wrong!"
              )
            );
        }
      }
    },
    [clients, setClients]
  );

  const addNewPeer = useCallback(
    async ({ peerId, createOffer, user: remoteUser }) => {
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
              if (!settled) clearInterval(interval);
            }, 300);
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
    },
    [addNewClient]
  );

  const addIceCandidateHandler = useCallback(
    async ({ peerId, icecandidate }) => {
      if (icecandidate) {
        await connectionsRef.current[peerId].addIceCandidate(icecandidate);
      }
    },
    []
  );

  const handleSessionDescription = useCallback(
    async ({ peerId, sessionDescription: remoteSessionDescription }) => {
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
    },
    []
  );

  const handleRemovePeer = useCallback(
    async ({ peerId, userId }) => {
      if (connectionsRef.current[peerId]) {
        connectionsRef.current[peerId].close();
      }

      delete connectionsRef.current[peerId];
      delete audioElementsRef.current[peerId];

      setClients((prevState) => {
        return prevState.filter((client) => client._id !== userId);
      });

      addSpeaker(roomId, userId, "remove")
        .then((res) => {})
        .catch((e) =>
          toast.error(
            e.response ? e.response.data.message : "something went wrong!"
          )
        );
    },
    [setClients]
  );

  const setMute = useCallback(
    (mute, userId) => {
      if (userId !== user._id) {
        let settled = false;
        const interval = setInterval(() => {
          if (audioElementsRef.current[userId]) {
            if (mute) {
              audioElementsRef.current[userId].volume = 0;
            } else {
              audioElementsRef.current[userId].volume = 1;
            }
            settled = true;
          }

          if (settled) {
            clearInterval(interval);
          }
        }, 200);
      }

      const clientIndex = clientsRef.current
        .map((client) => client._id)
        .indexOf(userId);

      const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
      if (clientIndex > -1) {
        connectedClients[clientIndex].isMute = mute;

        setClients(connectedClients);
      }
    },
    [setClients, user]
  );

  // mute status handling
  const muteStatusHandler = useCallback(
    (mute, userId) => {
      let settled = false;
      const interval = setInterval(() => {
        if (userMediaStream.current) {
          userMediaStream.current.getTracks()[0].enabled = !mute;

          if (mute && roomId && userId) {
            console.log("from mute handler", roomId, userId);
            socketRef.current.emit(ACTIONS.MUTE, { roomId, userId });
          } else if (!mute && roomId && userId) {
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

  useEffect(() => {
    // handling raisehand events
    socketRef.current.on(ACTIONS.HAND_RAISE, ({ client, peerId }) => {
      const response = window.confirm(`${client.name} wants to speak`);
      if (response) {
        const allClients = [...clients];
        client.isSpeaking = true;
        const indexOfClient = allClients.findIndex(
          (cli) => cli._id === client._id
        );
        if (indexOfClient > -1) {
          allClients.splice(indexOfClient, 1, client);
          socketRef.current.emit(ACTIONS.HAND_RAISE_CONFIRM, {
            roomId,
            allClients,
            peerId,
            client,
          });
        }
      }
    });

    return () => {
      socketRef.current.off(ACTIONS.HAND_RAISE);
    };
  }, [clients]);

  useEffect(() => {
    // on hand raise confirm
    socketRef.current.on(ACTIONS.HAND_RAISE_CONFIRM, ({ allClients }) => {
      setClients(allClients);
    });

    //mute/unmute events
    socketRef.current.on(ACTIONS.MUTE, ({ userId }) => {
      setMute(true, userId);
    });

    socketRef.current.on(ACTIONS.UN_MUTE, ({ userId }) => {
      setMute(false, userId);
    });
    socketRef.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer); // handling remove peer
    socketRef.current.on(
      ACTIONS.RELAY_SESSION_DESCRIPTION,
      handleSessionDescription
    ); // handling relay session description
    socketRef.current.on(ACTIONS.RELAY_ICE, addIceCandidateHandler); // handling relay ice event
    socketRef.current.on(ACTIONS.ADD_PEER, addNewPeer); // handling new peer

    return () => {
      socketRef.current.off(ACTIONS.ADD_PEER);
      socketRef.current.off(ACTIONS.RELAY_ICE);
      socketRef.current.off(ACTIONS.RELAY_SESSION_DESCRIPTION);
      socketRef.current.off(ACTIONS.REMOVE_PEER);
      socketRef.current.off(ACTIONS.MUTE);
      socketRef.current.off(ACTIONS.UN_MUTE);
    };
  }, [clients]);

  useEffect(() => {
    const getMediaStream = async () => {
      userMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };
    getMediaStream()
      .then(() => {
        addNewClient(
          {
            ...user,
            isMute: true,
            isSpeaking: user._id === roomCreator ? true : false,
          },
          () => {
            const localElement = audioElementsRef.current[user._id];
            if (localElement) {
              localElement.volume = 0;
              localElement.srcObject = userMediaStream.current;
            }
            socketRef.current.emit(ACTIONS.JOIN, {
              roomId,
              user: {
                ...user,
                isMute: true,
                isSpeaking: user._id === roomCreator ? true : false,
              },
            });
          }
        );
      })
      .catch((e) => console.log(e));

    return () => {
      // Leaving the room

      userMediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      socketRef.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);

  return {
    clients,
    provideRef,
    muteStatusHandler,
    raiseHandHandler,
  };
};
