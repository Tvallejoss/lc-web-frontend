// Config
import config from "../../../config";

// Hooks
import axios from "axios";
import { encrypt } from "../../secure-data/crypt";
import { getFileName } from "../fileName/getFileName";

const fileType = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/octet-stream"

];
export const uploadExcel = (e) => {
    const isUserLog = JSON.parse(localStorage.getItem("UserLoggedInfo"));
    let selectedFile = e.target.files[0];
    if (selectedFile) {
        if (selectedFile && fileType.includes(selectedFile.type)) {
            let reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onloadend = async (e) => {
                const encryptedPdf = {
                    bytes: await encrypt(config.KEY, e.target.result),
                };
                try {
                    await axios.post(
                        config.IP + config.PUERTO + "/loadExcelTemplate",
                        encryptedPdf,
                        {
                            headers: {
                                token: `${isUserLog}`,
                                pdfName: getFileName(selectedFile.name),
                            },
                        }
                    );

                    alert("Template Cargado Con Exito");
                } catch (error) {
                    console.error("Error al subir el Excel:", error);
                }
            };
        } else {
            alert("No es un archivo Excel");
        }
    } else {
        console.log("select your file");
    }
};
