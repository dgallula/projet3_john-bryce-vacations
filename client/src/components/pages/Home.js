import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { options, setDataset } from "../../common/Charts.js";
import VacationsFunctions from "../../common/VacationsFunctions.js";
import CircularProgressWithLabel from "../UI/CircularProgressWithLabel.js";

const Home = () => {
  const [vacationsList, setVacationsList] = useState([]);
  const [vacationsFolowers, setVacationsFolowers] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [progress, setProgress] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const getVacationsList = async () => {
    const list = await VacationsFunctions.getAllVacations();
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 35
      );
    }, 600);
    const followersCount =
      await VacationsFunctions.getVacationsFollowersCount();

    setVacationsList(list);

    setVacationsFolowers(followersCount);
    return () => {
      clearInterval(timer);
    };
  };
  useEffect(() => {
    getVacationsList();
  }, []);

  useEffect(() => {
    if (vacationsList.length > 0 && vacationsFolowers.length > 0) {
      const tempChartData = setDataset(vacationsList, vacationsFolowers);
      setChartData(tempChartData);
    }
    if (progress >= 100) {
      setIsLoading(false);
    }
  }, [vacationsList, vacationsFolowers, progress]);

  return (
    <>
      <h1>Followers summary</h1>
      {isLoading && <CircularProgressWithLabel value={progress} />}
      {vacationsList.length > 0 && !isLoading && (
        <Container>
          {chartData !== null && <Bar options={options} data={chartData} />}
        </Container>
      )}

      {!isLoading && chartData === null && (
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
            No one is yet following the vacations,
          </Typography>
          <Typography variant='h5' component='h5' sx={{ color: " #adb5bd" }}>
            the graph will be updated as new users follow
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Home;
