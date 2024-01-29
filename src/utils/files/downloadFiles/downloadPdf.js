// Config
import config from "../../../config";

// Hooks
import axios from "axios";

import { decrypt } from "../../secure-data/decrypt";
import { encrypt } from "../../secure-data/crypt";

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

export const downloadAllOrders = async (ordenes) => {
    try {
        // Crear una instancia de JSZip
        const JSZip = require("jszip");
        const zip = new JSZip();

        // Agregar el contenido PDF al ZIP
        const agregarOrdenAlZIP = async (orden) => {
            // Crear un nombre único para el archivo PDF
            const nombreArchivo = `#${orden.idOrden}-${orden.nombre}-${orden.apellido}.pdf`;

            // Convertir la cadena base64 a un blob
            const binaryPdf = atob(orden.pdfSrc.split(",")[1]);
            const pdfBlob = new Blob(
                [
                    new Uint8Array(binaryPdf.length).map((_, i) =>
                        binaryPdf.charCodeAt(i)
                    ),
                ],
                { type: "application/pdf" }
            );

            // Agregar el blob al ZIP
            zip.file(nombreArchivo, pdfBlob, { binary: true });
        };

        // Descargar cada orden y agregarla al ZIP
        await Promise.all(ordenes.map(agregarOrdenAlZIP));

        // Generar el ZIP
        const blob = await zip.generateAsync({ type: "blob" });

        // Encryptar los ids
        const idsOrdenes = await Promise.all(
            ordenes.map(async (orden) => {
                return await encrypt(config.KEY, orden.idOrden);
            })
        );
        const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
        // Realizar la solicitud al backend con los IDs de las órdenes para actualizar el flag
        await axios.post(
            config.IP + config.PUERTO + "/actualizarFlagDescargaOrden",
            {
                token: token,
                idOrdenes: idsOrdenes,
            }
        );

        // Crear un enlace de descarga
        const enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(blob);
        enlace.download = "ordenes.zip";
        enlace.click();

        // Despachar la acción de reseteo de órdenes después de completar la descarga
        // dispatch(resetOrdenes());
    } catch (error) {
        console.error("Error durante la descarga:", error);
        throw error;
    }
};
