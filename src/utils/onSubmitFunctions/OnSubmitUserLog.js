import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
const config = require("../../config");

//FUNCION PARA LOGEARSE
export const OnSubmitUserLog = (
    estado,
    RUTA,
    DISPATCH,
    NAVIGATE,
    setEstado,
    LOCAL_STORAGE,
) => {
    const userLogAxios = new Promise((resolve, reject) =>
        axios
            .post(config.IP + config.PUERTO + RUTA, estado)
            .then(({ data }) => {
                setTimeout(() => {
                    window.localStorage.setItem(
                        LOCAL_STORAGE,
                        JSON.stringify(data)
                    );
                    DISPATCH(setEstado(data));
                    const decodedToken = jwtDecode(data)
                    if (decodedToken.rol === "ADMIN") {
                        NAVIGATE("/ADMIN");
                    } else {
                        NAVIGATE("/home");
                    }
                }, 2000);
            })
            .catch((error) => reject(error))
    );

    toast.promise(userLogAxios, {
        pending: {
            render() {
                return "Iniciando Session";
            },
            icon: "🟢",
        },
        success: {
            render({ data }) {
                return `Usuario log ${data}`;
            },
            //Otras opciones
            icon: "🟢",
        },
        error: {
            render({ data }) {
                if(data.response){
                    return `${data.response.data.Error}`
                }
                else {
                    return `Error, vuelve a intentarlo mas tarde`
                }
            },
        },
    });
};
