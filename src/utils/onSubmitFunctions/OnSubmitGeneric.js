import axios from "axios";
// eslint-disable-next-line
import { addToken } from "../auth/addToken";
const config = require("../../config");

export const OnSubmitGeneric = (
    estado,
    RUTA,
    setEstado,
    LOCAL_STORAGE,
    NAVIGATE
) => {
    let newInfo = estado;

    axios
        .post(config.IP + config.PUERTO + RUTA, addToken(newInfo))
        .then(({ data }) => {
            window.localStorage.setItem(LOCAL_STORAGE, JSON.stringify(data));
            setEstado(data);
            NAVIGATE("/dashboard");
        })
        .catch((error) => {
            // alert("Error en el submit");
            console.log("Error Axios orden", error);
            return error;
        });
};
