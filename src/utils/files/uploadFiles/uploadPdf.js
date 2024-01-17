// Config
import config from "../../../config";

// Hooks
import axios from "axios";
import { encrypt } from "../../secure-data/crypt";
import { getFileName } from "../fileName/getFileName";

const fileType = ["application/pdf"];
export const uploadPdf = (e) => {
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
                        config.IP + config.PUERTO + "/loadPDFInstructive",
                        encryptedPdf,
                        {
                            headers: {
                                token: `${isUserLog}`,
                                pdfName: getFileName(selectedFile.name),
                            },
                        }
                    );

                    alert("Instructivo Cargado Con Exito");
                } catch (error) {
                    console.error("Error al subir el Instructivo:", error);
                }
            };
        } else {
            alert("No es un archivo PDF");
        }
    } else {
        console.log("select your file");
    }
};
