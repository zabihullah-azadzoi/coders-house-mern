import React, { useEffect, useState } from "react";
import "react-tooltip/dist/react-tooltip.css";
import styles from "./Room.module.css";
import { useSelector } from "react-redux";
import { useWebRTC } from "../../hooks/useWebRTC";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getRoom } from "../../http/roomRequests";
import { toast } from "react-toastify";
import { Modal, Tooltip } from "antd";
import { Tooltip as ReactTooltip } from "react-tooltip";

const Room = () => {
  const [room, setRoom] = useState("");
  const [mute, setMute] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [mics, setMics] = useState([]);
  const [audioSource, setAudioSource] = useState("");
  const [clientId, setClientId] = useState("");

  const { roomId } = useParams();
  const { state: roomCreator } = useLocation();
  const user = useSelector((state) => state.auth.user);

  const {
    clients,
    provideRef,
    muteStatusHandler,
    raiseHandHandler,
    confirmRequestFlagRef,
  } = useWebRTC(
    user,
    roomId,
    room,
    roomCreator,
    setModalText,
    setOpenModal,
    audioSource,
    setMics
  );

  const navigate = useNavigate();

  const handleOk = () => {
    confirmRequestFlagRef.current();
    setOpenModal(false);
  };

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
    navigate("/rooms", { replace: true });
    window.location.reload();
  };

  console.log(clientId);

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
          <h6 className="fw-bold">{room?.title}</h6>
          <div>
            {clients &&
              !clients.find((cli) => cli._id === user._id)?.isSpeaking && (
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
              )}
            {user?._id !== room?.creator?._id && (
              <span className={styles.emojiContainer} onClick={goBackHandler}>
                <img
                  src="/img/leave-quietly-emoji.png"
                  alt="vector"
                  className={styles.leftArrow}
                />
                <span className="ms-2">Leave quietly</span>
              </span>
            )}
          </div>
        </div>
        <div className="d-flex mb-5">
          <Modal
            title="New Coder's joining request to the Board."
            open={openModal}
            onOk={handleOk}
            okText="Confirm"
            onCancel={() => setOpenModal(false)}
          >
            {modalText}
          </Modal>
          {clients.length > 0 &&
            clients
              .filter((cli) => cli.isSpeaking === true)
              .map((client) => {
                return (
                  <div
                    key={client._id}
                    className={styles.memberContainer}
                    // onMouseOver={(e) => setClientId(e.target.id)}
                  >
                    <audio
                      ref={(instance) => provideRef(instance, client._id)}
                      autoPlay
                    />
                    <div className="position-relative">
                      <img
                        className={styles.memberAvatar}
                        src={client.avatar ? client.avatar : "/img/monkey.png"}
                        alt="avatar"
                        style={{ borderColor: client.borderColor }}
                      />

                      <img
                        onClick={() => muteHandler(client._id)}
                        src={
                          client.isMute
                            ? "/img/mute-icon.png"
                            : "/img/unmute-icon.png"
                        }
                        alt="avatar"
                        className={styles.micIcon}
                      />
                    </div>
                    <h6>{client.name}</h6>
                  </div>
                );
              })}
        </div>
        <ReactTooltip
          anchorId={clientId}
          position="bottom"
          content="Hello baya jan"
        />
        <div>
          <h6>others in the room</h6>
          <div className="d-flex flex-wrap">
            {clients.length > 0 &&
              clients
                .filter((cli) => cli.isSpeaking === false)
                .map((client) => {
                  return (
                    <div key={client._id} className={styles.memberContainer}>
                      <div className="position-relative">
                        <img
                          className={styles.memberAvatar}
                          src={
                            client.avatar ? client.avatar : "/img/monkey.png"
                          }
                          alt="avatar"
                          style={{ borderColor: client.borderColor }}
                        />
                      </div>
                      <h6>{client.name}</h6>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
      {clients?.find((cli) => cli._id === user._id)?.isSpeaking && (
        <div className={styles.micsContainer}>
          <Tooltip title={mute ? "unmute" : "mute"}>
            <img
              onClick={() => muteHandler(user._id)}
              src={
                clients?.find((cli) => cli._id === user._id)?.isMute
                  ? "/img/mute-icon.png"
                  : "/img/unmute-icon.png"
              }
              alt="avatar"
              className={`${styles.micIcon} ${styles.mainMic} position-static`}
            />
          </Tooltip>

          <Tooltip title="Choose a mic">
            <select
              className={styles.selectMenu}
              onChange={(e) => setAudioSource(e.target.value)}
            >
              {mics.map((mic, index) => {
                return (
                  <option value={mic.deviceId} key={index}>
                    {mic.label}
                  </option>
                );
              })}
            </select>
          </Tooltip>
          {user?._id === room?.creator?._id && (
            <span className={styles.endRoomSpan} onClick={goBackHandler}>
              End the room
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default Room;
