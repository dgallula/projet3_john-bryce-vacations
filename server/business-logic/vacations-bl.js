import vacationsDal from "../data-access-layer/vacations-dal.js";

const getAll = () => {
  return vacationsDal.getAll();
};

const getBy = (id) => {
  return vacationsDal.getVacationById(id);
};

const getFollowers = () => {
  return vacationsDal.getAllFollowers();
};

const getNumOfVacationsFollowers = () => {
  return vacationsDal.getNumOfVacationsFollowers();
};

const addVacation = (newVacationBody) => {
  return vacationsDal.anddNewVacation(newVacationBody);
};

const updateVacation = (id, vacation) => {
  return vacationsDal.update(id, vacation);
};

const addNewFollower = (userId, vacationId) => {
  return vacationsDal.addNewFollowerToDB(userId, vacationId);
};

const deleteVacation = (id) => {
  return vacationsDal.deleteVacation(id);
};

const deleteFollower = (vacationId, uId) => {
  return vacationsDal.deleteFollower(vacationId, uId);
};

export default {
  getAll,
  getBy,
  addVacation,
  deleteVacation,
  getFollowers,
  addNewFollower,
  deleteFollower,
  updateVacation,
  getNumOfVacationsFollowers,
};
