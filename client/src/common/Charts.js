import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Vacations Followers",
    },
  },
};

export const setDataset = (vacationsArray, followersArray) => {
  const temp = vacationsArray.filter((vacation) => {
    if (
      followersArray.find((follower) => follower.vacationId === vacation.id)
    ) {
      return vacation;
    }
  });

  const tempLabels = temp.map((element) => {
    return element.destination;
  });

  const tempDataset = followersArray.map((follower) => {
    if (temp.find((vacation) => vacation.id === follower.vacationId)) {
      return follower.followers;
    }
  });

  let data = {
    labels: tempLabels,
    datasets: [
      {
        label: "Followers",
        data: tempDataset,
        backgroundColor: "rgba(21, 171, 191, 0.5)",
      },
    ],
  };

  return data;
};
