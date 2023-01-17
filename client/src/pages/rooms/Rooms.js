import React, { useState, useEffect } from "react";
import styles from "./Rooms.module.css";
import RoomCard from "../../components/RoomCard/RoomCard";
import RoomModal from "../../components/RoomModal/RoomModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { createRoom, getAllRooms } from "../../http/roomRequests";

const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [roomType, setRoomType] = useState("open");
  const [topic, setTopic] = useState("");
  const [allRooms, setAllrooms] = useState([]);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // fetch all rooms
  useEffect(() => {
    getAllRooms()
      .then((res) => {
        setAllrooms(res.data);
        console.log(res.data);
      })
      .catch((e) => toast.error("something went wrong!"));
  }, []);

  const createRoomHandler = () => {
    if (!user?._id || !topic || !roomType) return;
    createRoom(topic, roomType, user._id)
      .then((res) => {
        toast.success("New room is Created");
        setShowModal(false);
        // navigate(`/room/${res.data._id}`);
      })
      .catch((e) => toast.error("something went wrong!"));
  };

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
        {allRooms.length > 0 ? (
          allRooms.map((room) => {
            return <RoomCard room={room} key={room._id} />;
          })
        ) : (
          <p className={`${styles.noRoomText}`}>
            No active discussion is currently going on!
          </p>
        )}
      </div>
      {showModal && (
        <RoomModal
          onSetShowModal={() => setShowModal(false)}
          roomType={roomType}
          onChooseRoomType={setRoomType}
          onSetTopic={setTopic}
          topic={topic}
          onCreateRoom={createRoomHandler}
        />
      )}
    </div>
  );
};

export default Rooms;
