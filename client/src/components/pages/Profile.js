import { Container } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alerts from "../../common/Alerts.js";
import { updateInfo } from "../../stateManagement/user.js";
import {
  setUserInSessionStorage,
  updateUser,
} from "../../common/userActions.js";
import FormCard from "../UI/FormCard.js";

const Profile = (props) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);

  const updateProfileHandler = (userToUpdate, userId) => {
    updateUser(userToUpdate, userId);
    dispatch(updateInfo({ userInfo: userToUpdate, id: userId }));

    setUserInSessionStorage(user.userInfo);
    setShowAlert(true);
    setTimeout(clearAlert, 5000);
  };

  const clearAlert = () => {
    setShowAlert(false);
  };
  return (
    <>
      {showAlert &&
        Alerts.successAlert("Your profile was updated successfully")}
      <Container sx={{ mt: "15vh" }}>
        <FormCard
          title='Profile'
          updateProfile={updateProfileHandler}
          alert={showAlert}
        />
      </Container>
    </>
  );
};

export default Profile;
