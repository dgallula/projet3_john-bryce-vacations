import { useCallback } from "react";
import VacationForm from "../UI/VacationForm";
import VacationsFunctions from "../../common/VacationsFunctions.js";
import { useDispatch } from "react-redux";
import { setAlert } from "../../stateManagement/alert.js";
import { useNavigate } from "react-router-dom";

const AddVacation = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addVacationHandler = useCallback(
    (newVacationObj) => {
      VacationsFunctions.addNewVacation(newVacationObj);
      props.socketObj.emit("send_message", {
        message: "new vacation was added by the admin",
        time: new Date(),
      });

      dispatch(
        setAlert({
          type: "success",
          message: "The vacation has been added",
        })
      );
      navigate("/vacations");
    },
    [props.socketObj, navigate, dispatch]
  );

  return <VacationForm onAdd={addVacationHandler} />;
};

export default AddVacation;
