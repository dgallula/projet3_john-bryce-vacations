import { Dialog } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAlert } from "../../stateManagement/alert.js";

import VacationsFunctions from "../../common/VacationsFunctions";
import VacationForm from "./VacationForm";

const Modal = (props) => {
  const socketObj = props.socketObj;
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    props.onCloseModal();
  };

  const onSubmiteHandler = (vacation) => {
    socketObj.emit("send_message", {
      message: "Vacation was updated by the admin",
      time: new Date(),
    });
    dispatch(
      setAlert({
        type: "info",
        message: "The vacation has been updated",
      })
    );
    VacationsFunctions.updateVacation(vacation);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <VacationForm
        vacation={props.item}
        onClose={handleClose}
        onUpdate={onSubmiteHandler}
      />
    </Dialog>
  );
};

export default Modal;
