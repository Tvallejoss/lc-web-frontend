import { createSlice } from "@reduxjs/toolkit";


const user = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUserData: (state, action) => {
      return action.payload;
    },
    // Otras acciones relacionadas con el user, si es necesario
  },
});

export const { setUserData } = user.actions;

export default user.reducer;
