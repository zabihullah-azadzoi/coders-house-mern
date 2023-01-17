import React, { useState } from "react";
import styles from "./Rooms.module.css";
import RoomCard from "../../components/RoomCard/RoomCard";
import RoomModal from "../../components/RoomModal/RoomModal";

const dummy = [
  {
    title: "Which Framework id best for frontend?",
    speakers: [
      {
        id: 1,
        name: "Virat Kohli",
        avatar: "/img/monkey.png",
      },
      {
        id: 2,
        name: "Anushka Sharma",
        avatar: "/img/monkey.png",
      },
    ],
    totalParticipants: 8,
  },
  {
    title: "Which Framework id best for frontend?",
    speakers: [
      {
        id: 1,
        name: "Virat Kohli",
        avatar: "/img/monkey.png",
      },
      {
        id: 2,
        name: "Anushka Sharma",
        avatar: "/img/monkey.png",
      },
    ],
    totalParticipants: 8,
  },
  {
    title: "Which Framework id best for frontend?",
    speakers: [
      {
        id: 1,
        name: "Virat Kohli",
        avatar: "/img/monkey.png",
      },
      {
        id: 2,
        name: "Anushka Sharma",

        avatar: "/img/monkey.png",
      },
    ],
    totalParticipants: 8,
  },
  {
    title: "Which Framework id best for frontend?",
    speakers: [
      {
        id: 1,
        name: "Virat Kohli",
        avatar: "/img/monkey.png",
      },
      {
        id: 2,
        name: "Anushka Sharma",
        avatar: "/img/monkey.png",
      },
    ],
    totalParticipants: 8,
  },
];

const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [roomType, setRoomType] = useState("open");

  return (
    <div className={`${styles.Container} container pt-2 ps-5 pe-5`}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h6 className={`${styles.inputContainerSpan}`}>All Voice Rooms</h6>
          <div className={`${styles.inputContainer}`}>
            <img src="/img/search-icon.png" alt="search" />
            <input type="text" className={`${styles.textInput}`} />
          </div>
        </div>
        <div className="float-end">
          <button
            className={`${styles.startRoomButton}`}
            onClick={() => setShowModal(true)}
          >
            <img src="/img/sound-icon.png" alt="sound" />
            <span className="ms-2">Start a room</span>
          </button>
        </div>
      </div>
      <div className="row gap-3 m-0 mt-4 ">
        {dummy.map((room, index) => {
          return <RoomCard room={room} key={index} />;
        })}
      </div>
      {showModal && (
        <RoomModal
          onSetShowModal={() => setShowModal(false)}
          roomType={roomType}
          onChooseRoomType={setRoomType}
        />
      )}
    </div>
  );
};

export default Rooms;
