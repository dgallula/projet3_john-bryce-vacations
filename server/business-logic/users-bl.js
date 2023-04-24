import usersDal from "../data-access-layer/users-dal.js";

const getAll = () => {
  return usersDal.getAll();
};

const getUserBy = (email) => {
  return usersDal.getUserByEmail(email);
};

const addUser = (newUser) => {
  return usersDal.addNewUser(newUser);
};

const updateUser = (id, user) => {
  return usersDal.update(id, user);
};
export default {
  getAll,
  addUser,
  getUserBy,
  updateUser,
};
