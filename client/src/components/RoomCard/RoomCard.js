import React from "react";
import styles from "./RoomCard.module.css";

const RoomCard = ({ room }) => {
  return (
    <div className={`${styles.roomContainer} col-md-3 col-sm-12`}>
      <h6>{room.title}</h6>
      <div className={`${styles.speakersContainer} mt-3 `}>
        {room.speakers.map((speaker) => {
          return (
            <div key={speaker.id} className="position-relative ">
              <img
                src={speaker.avatar}
                alt="speaker avatar"
                className={`${styles.speakerAvatar}`}
              />
              <div className="float-end mt-2 w-100 d-flex justify-content-end">
                <span className="me-2">{speaker.name}</span>
                <img src="/img/chat-icon.png" alt="speaker avatar" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="d-flex align-items-center float-end mt-2 ">
        <span className={`${styles.participantsText}`}>
          {room.totalParticipants}
        </span>
        <img src="/img/person-icon.png" alt="speaker avatar" />
      </div>
    </div>
  );
};

export default RoomCard;
