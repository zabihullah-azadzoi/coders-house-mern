import React, { useState } from "react";
import styles from "./StepProfile.module.css";

import Card from "../../shared/card/Card";
import Button from "../../shared/button/Button";
import Loader from "../../shared/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setImage } from "../../../store/reducers/profileReducer";
import { activateProfileRequest } from "../../../http/activateRequests";
import { toast } from "react-toastify";

import { setAuth } from "../../../store/reducers/authReducer";

const StepProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { name, bio, username } = useSelector((state) => state.profile);
  const [profileImage, setProfileImage] = useState("");

  const dispatch = useDispatch();

  const randomColorGenerator = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const convertImageHandler = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfileImage(reader.result);
      dispatch(setImage({ image: reader.result }));
    };
  };

  const activateProfileHandler = () => {
    setIsLoading(true);
    activateProfileRequest(name, profileImage, bio, username)
      .then((res) => {
        setIsLoading(false);
        if (res.data.user) {
          dispatch(
            setAuth({
              user: { ...res.data.user, borderColor: randomColorGenerator() },
            })
          );
        }
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(
          e.response ? e.response.data.message : "Something went wrong!"
        );
      });
  };

  return (
    <>
      {isLoading ? (
        <Loader text="Activating your profile..." />
      ) : (
        <Card icon={"setProfile-emoji"} title={`Okay, ${name}`}>
          <p className={`${styles.profileParagraph}`}>How is this photo?</p>
          <div>
            <img
              src={profileImage ? profileImage : "/img/monkey.png"}
              alt="profile-dummy"
              className={styles.profileImage}
            />
          </div>
          <div>
            <label htmlFor="imageInput" className={styles.imageParagraph}>
              {" "}
              choose a different photo
              <input
                type="file"
                id="imageInput"
                accept="images/*"
                hidden
                onChange={(e) => convertImageHandler(e)}
              />
            </label>
          </div>

          <Button onNext={activateProfileHandler} />
        </Card>
      )}
    </>
  );
};

export default StepProfile;
