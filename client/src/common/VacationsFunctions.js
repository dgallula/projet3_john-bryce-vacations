import { io } from "socket.io-client";

const addNewVacation = async (newVacationObj) => {
  const preperdVacation = {
    ...newVacationObj,
    startDate: newVacationObj.startDate.substring(0, 10),
    endDate: newVacationObj.endDate.substring(0, 10),
  };

  const res = await fetch(`http://localhost:5000/api/vacations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preperdVacation),
  });
  const data = await res.json();
  return data;
};

const getAllVacations = async () => {
  const response = await fetch(`http://localhost:5000/api/vacations`);
  const data = await response.json();
  return data;
};

const getVacationsFollowersCount = async () => {
  const response = await fetch(
    `http://localhost:5000/api/group-vacations-followers`
  );
  const data = await response.json();
  return data;
};

const getVacationsFollowers = async () => {
  const response = await fetch(`http://localhost:5000/api/vacations-followers`);
  const data = await response.json();
  return data;
};

const addFollower = async (userId, vacationId) => {
  const preperdBody = {
    user: userId,
    vacation: vacationId,
  };

  const res = await fetch(`http://localhost:5000/api/vacations-followers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preperdBody),
  });
  const data = await res.json();
  return data;
};

export const updateVacation = async (updatedVacation) => {
  const preperdVacationBody = {
    ...updatedVacation,
    startDate: new Date(updatedVacation.startDate)
      .toISOString()
      .substring(0, 10),
    endDate: new Date(updatedVacation.endDate).toISOString().substring(0, 10),
  };

  const response = await fetch(
    `http://localhost:5000/api/vacations/${updatedVacation.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preperdVacationBody),
    }
  );
  const data = await response.json();
  return data;
};

const sendImage = async (formData) => {
  const response = await fetch(`http://localhost:5000/api/vacation-image`, {
    method: "POST",
    body: formData,
  });
  if (response) {
    console.log(response.statusText);
  }
};

const deleteVacation = async (id) => {
  const response = await fetch(`http://localhost:5000/api/vacations/${id}`, {
    method: "DELETE",
  });
  if (response) {
    console.log(response.statusText);
  }
};

const removeFollower = async (uId, vacationId) => {
  const preperdBody = { vacationId, userId: uId };

  const response = await fetch(
    `http://localhost:5000/api/vacations-followers`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preperdBody),
    }
  );
  if (response) {
    console.log(response.statusText);
  }
};

export const socket = io.connect("http://localhost:5001");

export default {
  sendImage,
  addNewVacation,
  getAllVacations,
  getVacationsFollowers,
  getVacationsFollowersCount,
  updateVacation,
  addFollower,
  removeFollower,
  deleteVacation,
};
