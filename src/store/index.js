import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

//State
import userReducer from "../state/user";
import clientReducer from "../state/clientSlice"; 
import pdfReducer from "../state/pdfByOrdenSelected";
import ordenesReducer from "../state/ordenes";

const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    reducer: {
        //usuarios
        user: userReducer,
        // client: clientReducer,
        clientSelected: clientReducer,
        //PDF BY ORDEN
        pdfByOrdenSelected: pdfReducer,
        //Ordenes
        ordenes: ordenesReducer,
    },
});

export default store;
