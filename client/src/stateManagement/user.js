import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isSignIn: false,
  fullName: "",
  userInfo: {},
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateInfo: (state, action) => {
      state.userInfo = {
        id: action.payload.id,
        firstName: action.payload.userInfo.firstName,
        lastName: action.payload.userInfo.lastName,
        email: action.payload.userInfo.email,
        role: state.userInfo.role,
      };
      state.fullName = `${state.userInfo.firstName} ${state.userInfo.lastName}`;
    },
    signIn: (state, action) => {
      state.isSignIn = true;
      state.userInfo = {
        id: action.payload.userInfo.id,
        firstName: action.payload.userInfo.firstName,
        lastName: action.payload.userInfo.lastName,
        email: action.payload.userInfo.email,
        role: action.payload.userInfo.role,
      };
      state.fullName = `${state.userInfo.firstName} ${state.userInfo.lastName}`;
    },

    signOut: () => initialState,
  },
});

export const { signIn, signOut, updateInfo } = userSlice.actions;

export default userSlice.reducer;
