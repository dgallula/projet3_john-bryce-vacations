import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isShow: false,
  type: "",
  message: "",
};
export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.isShow = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    dismissAlert: () => initialState,
  },
});

export const { setAlert, dismissAlert } = alertSlice.actions;

export default alertSlice.reducer;
