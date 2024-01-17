// Config
import config from "../../../config";

// Hooks
import axios from "axios";

// import { decrypt } from "../../secure-data/decrypt";

// Pedir Pdf al back
export const downloadPdf = () => {
    const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
    axios
        .post(config.IP + config.PUERTO + "/getPDFInstructive", {
            token: token,
        })
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.error("Error al obtener el PDF", error);
        });
};
