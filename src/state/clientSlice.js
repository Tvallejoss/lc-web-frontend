
import { createSlice } from "@reduxjs/toolkit";
const clientSlice = createSlice({
  name: "client",
  initialState: null,
  reducers: {
    setClientData: (state, action) => {
      return action.payload;
    },
    // Otras acciones relacionadas con el cliente, si es necesario
  },
});

export const { setClientData } = clientSlice.actions;

export default clientSlice.reducer;
