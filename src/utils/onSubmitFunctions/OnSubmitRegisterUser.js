import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import { addToken } from "../auth/addToken";
const config = require("../../config");

// const jwt = require("jsonwebtoken");

//FUNCION PARA REGISTRAR CLIENTES
export const OnSubmitRegisterUser = (
    estado,
    RUTA,
    DISPATCH,
    NAVIGATE,
    setEstado,
    LOCAL_STORAGE
) => {
    let newUser = estado;

    const userUpdate = new Promise((resolve, reject) => {
        axios
            .post(config.IP + config.PUERTO + RUTA, addToken(newUser))
            .then(({ data }) => {
                setTimeout(() => {
                    window.localStorage.setItem(
                        LOCAL_STORAGE,
                        JSON.stringify(data)
                    );
                    DISPATCH(setEstado(data));
                    NAVIGATE("/ADMIN");
                }, 2000);
            })
            .catch((error) => reject(error));
    });

    toast.promise(userUpdate, {
        pending: {
            render() {
                return "Registrando Origen";
            },
            icon: false,
        },
        success: {
            render({ data }) {
                return `Origen Registrado ${data}`;
            },
            //Otras opciones
            icon: "🟢",
        },
        error: {
            render({ data }) {
                if (data.response) {
                    // return `${data.response.data.Error}`;
                    return "Error al cargar origen"
                } else {
                    return `Server caido o no levantado`;
                }
            },
        },
    });
};
