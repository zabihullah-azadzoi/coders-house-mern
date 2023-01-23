import axiosInstance from "./index";

export const createRoom = async (title, type, creator) => {
  return await axiosInstance.post("/api/rooms", { title, type, creator });
};

export const getAllRooms = async () => {
  return await axiosInstance.get("/api/rooms");
};

export const getRoom = async (roomId) => {
  return await axiosInstance.get(`/api/rooms/${roomId}`);
};

export const addSpeaker = async (roomId, speakerId, flag) => {
  return await axiosInstance.patch(`/api/rooms/${roomId}`, { speakerId, flag });
};
