// Config
import config from "../../../config";

// Hooks
import axios from "axios";

// import { decrypt } from "../../secure-data/decrypt";

// Pedir Excel al back
export const downloadExcel = () => {
    const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
    axios
        .post(
            config.IP + config.PUERTO + "/getExcelTemplate",
            { token: token },
            { responseType: "text" }
        )
        .then(({ data }) => {
            const fileName = "Excel-Template.xlsx";
            const mimeType =
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            downloadFile(data, fileName, mimeType);
        })
        .catch((error) => {
            console.error("Error al obtener el Excel", error);
        });
};

// Funcion que se encarga de descargar el excel
const downloadFile = (base64String, fileName, mimeType) => {
    try {
        // Limpiar el string en base64 de caracteres no válidos
        const cleanBase64String = base64String.replace(/[^A-Za-z0-9+/]/g, "");

        // Decodificar la cadena base64
        const decodedBase64 = atob(cleanBase64String);

        // Crear un Uint8Array a partir de la cadena decodificada
        const byteNumbers = new Array(decodedBase64.length);
        for (let i = 0; i < decodedBase64.length; i++) {
            byteNumbers[i] = decodedBase64.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Crear Blob desde Uint8Array
        const blob = new Blob([byteArray], { type: mimeType });

        // Abrir el Blob en una nueva ventana o pestaña
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");

        // Liberar recursos
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al descargar el archivo:", error);
    }
};
