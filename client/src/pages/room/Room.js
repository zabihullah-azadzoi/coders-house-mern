import React, { useEffect, useState } from "react";
import styles from "./Room.module.css";
import { useSelector } from "react-redux";
import { useWebRTC } from "../../hooks/useWebRTC";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getRoom } from "../../http/roomRequests";
import { toast } from "react-toastify";

const Room = () => {
  const [room, setRoom] = useState("");
  const [mute, setMute] = useState(true);
  const { roomId } = useParams();
  const { state: roomCreator } = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { clients, provideRef, muteStatusHandler, raiseHandHandler } =
    useWebRTC(user, roomId, roomCreator);
  const navigate = useNavigate();

  console.log(clients);

  useEffect(() => {
    muteStatusHandler(mute, user._id);
  }, [mute, user, muteStatusHandler]);

  useEffect(() => {
    getRoom(roomId)
      .then((res) => {
        setRoom(res.data);
      })
      .catch((e) =>
        toast.error(
          e.response ? e.response.data.message : "something went wrong!"
        )
      );
  }, [roomId]);

  const muteHandler = (clientId) => {
    if (clientId !== user._id) return;
    setMute((prevState) => !prevState);
  };

  const goBackHandler = () => {
    navigate("/rooms");
  };

  return (
    <>
      <div className={`${styles.Container} container pt-2 ps-5 pe-5`}>
        <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
          <div className={styles.allRoomsTitle} onClick={goBackHandler}>
            <img
              src="/img/left-arrow-icon.png"
              alt="vector"
              className={styles.leftArrow}
            />
            <h6 className="m-0 ms-2">All Voice Rooms</h6>
          </div>
        </div>
      </div>
      <div className={styles.membersContainerWrapper}>
        <div className="d-flex justify-content-between">
          <h6 className="fw-bold">{room.title}</h6>
          <div>
            <span
              className={styles.emojiContainer}
              onClick={() =>
                raiseHandHandler(
                  { ...user, isMute: true },
                  roomId,
                  room.creator._id
                )
              }
            >
              <img
                src="/img/raise-hand-emoji.png"
                alt="vector"
                className={styles.leftArrow}
              />
            </span>
            <span className={styles.emojiContainer}>
              <img
                src="/img/leave-quietly-emoji.png"
                alt="vector"
                className={styles.leftArrow}
              />
              <span className="ms-2">Leave quietly</span>
            </span>
          </div>
        </div>
        <div className="d-flex mb-5">
          {clients.length > 0 &&
            clients
              .filter((cli) => cli.isSpeaking === true)
              .map((client) => {
                return (
                  <div key={client._id} className={styles.memberContainer}>
                    <audio
                      ref={(instance) => provideRef(instance, client._id)}
                      // controls
                      autoPlay
                    />
                    <div className="position-relative">
                      <img
                        className={styles.memberAvatar}
                        src={client.avatar ? client.avatar : "/img/monkey.png"}
                        alt="avatar"
                        style={{ borderColor: client.borderColor }}
                      />
                      {client.isMute ? (
                        <img
                          onClick={() => muteHandler(client._id)}
                          src="/img/mute-icon.png"
                          alt="avatar"
                          className={styles.micIcon}
                        />
                      ) : (
                        <img
                          onClick={() => muteHandler(client._id)}
                          src="/img/unmute-icon.png"
                          alt="avatar"
                          className={styles.micIcon}
                        />
                      )}
                    </div>
                    <h6>{client.name}</h6>
                  </div>
                );
              })}
        </div>
        <div>
          <h6>others in the room</h6>
          <div className="d-flex ">
            {clients.length > 0 &&
              clients
                .filter((cli) => cli.isSpeaking === false)
                .map((client) => {
                  return (
                    <div key={client._id} className={styles.memberContainer}>
                      {/* <audio
                    ref={(instance) => provideRef(instance, client._id)}
                    // controls
                    autoPlay
                  /> */}
                      <div className="position-relative">
                        <img
                          className={styles.memberAvatar}
                          src={
                            client.avatar ? client.avatar : "/img/monkey.png"
                          }
                          alt="avatar"
                          style={{ borderColor: client.borderColor }}
                        />
                        {/* {client.isMute ? (
                      <img
                        onClick={() => muteHandler(client._id)}
                        src="/img/mute-icon.png"
                        alt="avatar"
                        className={styles.micIcon}
                      />
                    ) : (
                      <img
                        onClick={() => muteHandler(client._id)}
                        src="/img/unmute-icon.png"
                        alt="avatar"
                        className={styles.micIcon}
                      />
                    )} */}
                      </div>
                      <h6>{client.name}</h6>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
