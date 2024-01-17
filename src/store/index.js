import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

//State
import userReducer from "../state/user";
// import clientReducer from "../state/client";
import clientReducer from "../state/clientSlice"; // Importa el "slice" creado anteriormente
import pdfReducer from "../state/pdfByOrdenSelected";

const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    reducer: {
        //usuarios
        user: userReducer,
        // client: clientReducer,
        clientSelected: clientReducer,
        //PDF BY ORDEN
        pdfByOrdenSelected: pdfReducer,
    },
});

export default store;
