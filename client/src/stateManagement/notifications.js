import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messageToSend: "",
  messagesArray: [],
};

export const notifications = createSlice({
  name: "socket",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.messagesArray.push({
        message: action.payload.message,
        timeStemp: action.payload.time,
      });
    },
    clearNotifications: () => initialState,
  },
});

export const { addNotification, clearNotifications } = notifications.actions;

export default notifications.reducer;
