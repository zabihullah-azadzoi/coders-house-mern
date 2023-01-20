import React from "react";
import styles from "./RoomModal.module.css";
import TextInput from "../shared/textInput/TextInput";

const RoomModal = ({
  onSetShowModal,
  onChooseRoomType,
  roomType,
  topic,
  onSetTopic,
  onCreateRoom,
}) => {
  return (
    <div className={`${styles.modalContainer}`}>
      <div className={`${styles.modalMask}`} onClick={onSetShowModal}></div>
      <div className={`${styles.modal} position-relative`}>
        <button
          className={`${styles.closeModalButton}`}
          onClick={onSetShowModal}
        >
          X
        </button>
        <div className=" pb-5 mb-2 border-bottom border-secondary mt-2">
          <h6 className="mb-3">Enter the Topic to be discussed</h6>
          <TextInput onChangeHandler={onSetTopic} value={topic} />
        </div>
        <div className={`${styles.modalBody}`}>
          <p className="fw-bold">Room Type</p>
          <div className="d-flex justify-content-between mb-4">
            <div
              className={`${styles.roomTypeContainer} ${
                roomType === "open" ? styles.activeGroup : ""
              }`}
              onClick={() => onChooseRoomType("open")}
            >
              <img src="/img/open-room.png" alt="open-room" />
              <span className="mt-1">open</span>
            </div>
            <div
              className={`${styles.roomTypeContainer} ${
                roomType === "social" ? styles.activeGroup : ""
              }`}
              onClick={() => onChooseRoomType("social")}
            >
              <img src="/img/social-room.png" alt="social-room" />
              <span className="mt-1">social</span>
            </div>
            <div
              className={`${styles.roomTypeContainer} ${
                roomType === "private" ? styles.activeGroup : ""
              }`}
              onClick={() => onChooseRoomType("private")}
            >
              <img src="/img/private-room.png" alt="private-room" />
              <span className="mt-1">private</span>
            </div>
          </div>
          <div className="text-center">
            <p className={`${styles.modalFooterText}`}>
              Start a room, open to everyone
            </p>
            <button className={`${styles.modalButton}`} onClick={onCreateRoom}>
              <img
                src="/img/create-room-button-icon.png"
                alt="create-room-button-icon"
              />
              <span className="ms-2 fw-bold">Let's GO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;