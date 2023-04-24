import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.js";
import notificationsReducer from "./notifications.js";
import alertReducer from "./alert.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    notifications: notificationsReducer,
    alert: alertReducer,
  },
});
