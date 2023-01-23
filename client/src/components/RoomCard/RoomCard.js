import React from "react";
import styles from "./RoomCard.module.css";

const RoomCard = ({ room, onRoom }) => {
  const speakersArrayLengthHandler = (array) => {
    if (array.length < 3) return array;
    const fixedSizeArray = [];
    fixedSizeArray[0] = array[0];
    fixedSizeArray[1] = array[1];
    return fixedSizeArray;
  };

  return (
    <div
      className={`${styles.roomContainer} col-md-3 col-sm-12`}
      onClick={onRoom}
    >
      <h6>{room.title}</h6>
      <div className={`${styles.speakersContainer} mt-3 `}>
        {speakersArrayLengthHandler(room.speakers).map((speaker) => {
          return (
            <div key={speaker._id} className="position-relative ">
              <img
                src={speaker.image ? speaker.image : "/img/monkey.png"}
                alt="speaker avatar"
                className={`${styles.speakerAvatar} ${
                  room.speakers.length === 1 && "position-static"
                }`}
              />
              <div
                className={`${styles.speakerName} ${
                  room.speakers.length === 1 && "w-auto"
                }`}
              >
                <span className="me-2">{speaker.name}</span>
                <img src="/img/chat-icon.png" alt="speaker avatar" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="d-flex align-items-center float-end mt-2 ">
        <span className={`${styles.participantsText}`}>
          {room.speakers.length}
        </span>
        <img src="/img/person-icon.png" alt="speaker avatar" />
      </div>
    </div>
  );
};

export default RoomCard;
