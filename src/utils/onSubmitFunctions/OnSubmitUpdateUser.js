import axios from "axios";
import config from "../../config";
import { addToken } from "../auth/addToken";

//Funcion para modificar clientes
export const OnSubmitUpdateUser = (
    estadoAnterior,
    newDataUser,
    RUTA,
    DISPATCH,
    NAVIGATE,
    setEstado,
    LOCAL_STORAGE
) => {
    let UserUpdate = estadoAnterior;
    for (const key in newDataUser) {
        UserUpdate = {
            ...UserUpdate,
            [key]: newDataUser[key],
        };
    }
    axios
        .post(config.IP + config.PUERTO + RUTA, addToken(UserUpdate))
        .then(({ data }) => {
            setEstado(data);
            console.log("DATA DE UPDATE USER", data);
            NAVIGATE("/ADMIN");
        })
        .catch((error) => {
            alert("Error en el user update");
            console.log("Error Axios", error);
        });
};
