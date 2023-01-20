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

  const provideRef = (instance, clientId) => {
    audioElementsRef.current[clientId] = instance;
  };

  useEffect(() => {
    socketRef.current = socketConnection();
  }, []);

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
          socketRef.current.emit(ACTIONS.JOIN, { roomId, user });
        });
      })
      .catch((e) => console.log(e));

    return () => {
      // Leaving the room
      userMediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });

      socketRef.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, [setClients, user, addNewClient, roomId]);

  // adding new peer
  useEffect(() => {
    const addNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      console.log("here", peerId, "createOffer", createOffer);
      // check if peer already exist!
      // if (peerId in connectionsRef.current) return;

      // connectionsRef.current[peerId] = new RTCPeerConnection({
      //   iceServers: freeice(),
      // });

      // // handling new ice candidate
      // connectionsRef.current[peerId].onicecandidate = (e) => {
      //   socketRef.current.emit(ACTIONS.RELAY_ICE, {
      //     peerId,
      //     icecandidate: e.candidate,
      //   });
      // };

      // // handling on track on current peer connection
      // connectionsRef.current[peerId].ontrack = ({
      //   streams: [remoteStream],
      // }) => {
      //   addNewClient(remoteUser, () => {
      //     if (audioElementsRef.current[remoteUser._id]) {
      //       audioElementsRef.current[remoteUser._id].srcObject = remoteStream;
      //     } else {
      //       // rendering all clients might get a bit longer that's why we are using interval to check every second if clients list is updated and when it's updated and audio element is available than we are clearing the interval again.
      //       let settled = true;
      //       const interval = setInterval(() => {
      //         if (audioElementsRef.current[remoteUser._id]) {
      //           audioElementsRef.current[remoteUser._id].srcObject =
      //             remoteStream;

      //           settled = false;
      //         }
      //       }, 1000);
      //       if (!settled) clearInterval(interval);
      //     }
      //   });
      // };

      // // adding current's user or local tracks to remote connection
      // userMediaStream.current.getTracks().forEach((track) => {
      //   connectionsRef.current[peerId].addTrack(track, userMediaStream.current);
      // });

      // // create offer
      // if (createOffer) {
      //   const offer = await connectionsRef.current[peerId].createOffer();
      //   await connectionsRef.current[peerId].setLocalDescription(offer);

      //   socketRef.current.emit(ACTIONS.RELAY_SESSION_DESCRIPTION, {
      //     peerId,
      //     sessionDescription: offer,
      //   });
      // }
    };

    socketRef.current.on(ACTIONS.ADD_PEER, (obj) => {
      console.log(obj);
    });

    return () => socketRef.current.off(ACTIONS.ADD_PEER);
  }, [addNewClient]);

  // handling relay ice event
  useEffect(() => {
    socketRef.current.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connectionsRef.current[peerId].addIceCandidate(icecandidate);
      }
    });

    return () => {
      socketRef.current.off(ACTIONS.RELAY_ICE);
    };
  }, []);

  // handling relay session description
  useEffect(() => {
    const handleSessionDescription = ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connectionsRef.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );

      // if session description type is offer than create an answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connectionsRef.current[peerId];
        const answer = connection.createAnswer();
        connection.setLocalDescription(answer);

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

  return { clients, provideRef };
};
