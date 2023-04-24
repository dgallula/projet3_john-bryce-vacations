import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VacationsFunctions from "../../common/VacationsFunctions.js";
import { setAlert } from "../../stateManagement/alert.js";
import CircularProgressWithLabel from "../UI/CircularProgressWithLabel.js";
import VacationCard from "../UI/VacationCard";

const Vacations = (props) => {
  const socket = props.socketObj;
  const dispatch = useDispatch();
  const [vacationsList, setVacationsList] = useState([]);
  const [vacationsFolowers, setVacationsFolowers] = useState([]);
  const [vacationsFolowersList, setVacationsFolowersList] = useState([]);
  const [progress, setProgress] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user);

  const getVacationsList = async () => {
    const list = await VacationsFunctions.getAllVacations();
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress === 100 ? 0 : prevProgress + 25
      );
    }, 800);

    const followersCount =
      await VacationsFunctions.getVacationsFollowersCount();
    const listOfAllFollowers = await VacationsFunctions.getVacationsFollowers();
    const filteredUserVacationsList = listOfAllFollowers.filter(
      (follower) => follower.userId === user.userInfo.id
    );
    setVacationsFolowersList(filteredUserVacationsList);
    setVacationsFolowers(followersCount);

    sortVacations(list, filteredUserVacationsList);
    return () => {
      clearInterval(timer);
    };
  };

  const sortVacations = (vacations, userVacations) => {
    let tempUserVacationsArray = [],
      newVacationsArray = [];

    vacations.forEach((vacation) => {
      userVacations.forEach((userVacation) => {
        if (vacation.id === userVacation.vacationId) {
          tempUserVacationsArray.push(vacation);
        }
      });
    });
    newVacationsArray = [...tempUserVacationsArray];
    vacations.forEach((v) => {
      const temp = tempUserVacationsArray.find(
        (element) => element.id === v.id
      );
      if (!temp) {
        newVacationsArray.push(v);
      }
    });
    setVacationsList(newVacationsArray);
  };

  useEffect(() => {
    getVacationsList();
    if (vacationsList !== null && progress >= 100) {
      setIsLoading(false);
    }
  }, [vacationsList, progress]);

  const followEventHandler = (id) => {
    VacationsFunctions.addFollower(user.userInfo.id, id);
    getVacationsList();
  };

  const unFollowHandler = (vacationId) => {
    VacationsFunctions.removeFollower(user.userInfo.id, vacationId);
    getVacationsList();
  };

  const deleteVacationHandler = (vacationId) => {
    VacationsFunctions.deleteVacation(vacationId);
    dispatch(
      setAlert({
        type: "warning",
        message: "The vacation has been deleted",
      })
    );

    socket.emit("send_message", {
      message: "Vacation was deleted by the admin",
      time: new Date(),
    });
  };

  return (
    <>
      <h1>Our Vacations</h1>
      {isLoading && <CircularProgressWithLabel value={progress} />}
      {!isLoading && vacationsList.length > 0 && (
        <Grid
          container
          direction='row'
          justifyContent='space-evenly'
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {vacationsList.map((vacation) => {
            return (
              <Grid item key={`vacation-${vacation.id}`}>
                <VacationCard
                  item={vacation}
                  followers={vacationsFolowers}
                  addFollower={followEventHandler}
                  unFollow={unFollowHandler}
                  usersVacations={vacationsFolowersList}
                  socketObj={socket}
                  onDelete={deleteVacationHandler}
                />
              </Grid>
            );
          })}
        </Grid>
      )}

      {!isLoading && vacationsList.length === 0 && (
        <Box
          sx={{
            width: 500,
            height: 300,
            backgroundColor: "#c5f6fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            m: "auto",
            borderRadius: "5%",
          }}
        >
          <Typography variant='h3' component='h3' sx={{ color: "#868e96" }}>
            No vacations yet,
          </Typography>
          <Typography variant='h5' component='h5' sx={{ color: " #adb5bd" }}>
            new vacations will be coming soon
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Vacations;
