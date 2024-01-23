import { createSlice } from "@reduxjs/toolkit";

const ordenes = createSlice({
    name: "ordenes",
    initialState: [],
    reducers: {
        setOrdenesDownload: (state, action) => {
            const { id, isChecked, pdfContent, name } = action.payload;
            // Si el checkbox está marcado, agrega la orden al estado global
            if (isChecked) {
                state.push({ idOrden: id, name: name, pdf: pdfContent });
            } else {
                // Si el checkbox no está marcado, elimina la orden del estado global
                const index = state.findIndex((orden) => id === id);
                if (index !== -1) {
                    state.splice(index, 1);
                }
            }
        },
        resetOrdenes: (state) => {
            // Esta acción restablece el estado a su valor inicial (vacío en este caso)
            return [];
        },
        // Otras acciones relacionadas con las órdenes, si es necesario
    },
});

export const { setOrdenesDownload, resetOrdenes } = ordenes.actions;

export default ordenes.reducer;
