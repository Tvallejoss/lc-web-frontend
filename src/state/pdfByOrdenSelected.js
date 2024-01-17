import { createSlice } from "@reduxjs/toolkit";

const pdfSlice = createSlice({
    name: "pdf",
    initialState: null,
    reducers: {
        setPdfByOrdenSelected: (state, action) => {
            return action.payload;
        },
        // Otras acciones relacionadas con el PDF, si es necesario
    },
});

export const { setPdfByOrdenSelected } = pdfSlice.actions;

export default pdfSlice.reducer;
