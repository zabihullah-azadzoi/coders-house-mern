import axios from "axios";

export const activateProfileRequest = async (name, image) => {
  return await axios.post(
    "http://localhost:5000/api/activate",
    {
      name,
      image,
    },
    {
      withCredentials: true,
    }
  );
};
