import config from "../config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { encrypt } from "../utils/secure-data/crypt";

// Definir la acción asincrónica para la descarga de órdenes
export const downloadOrders = createAsyncThunk(
    "ordenes/downloadOrders",
    async (ordenesActuales, { dispatch, getState }) => {
        try {
            // Crear una instancia de JSZip
            const JSZip = require("jszip");
            const zip = new JSZip();

            // Agregar el contenido PDF al ZIP
            const agregarOrdenAlZIP = async (orden) => {
                // Crear un nombre único para el archivo PDF
                const nombreArchivo = `#${orden.idOrden}-${orden.name}.pdf`;

                // Convertir la cadena base64 a un blob
                const binaryPdf = atob(orden.pdf.split(",")[1]);
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
            await Promise.all(ordenesActuales.map(agregarOrdenAlZIP));

            // Generar el ZIP
            const blob = await zip.generateAsync({ type: "blob" });

            // Encryptar los ids
            const idsOrdenes = await Promise.all(
                ordenesActuales.map(async (orden) => {
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
    }
);

const ordenes = createSlice({
    name: "ordenes",
    initialState: [],
    reducers: {
        setOrdenesDownloadByChecked: (state, action) => {
            const { id, isChecked, pdf, name } = action.payload;
            // Si el checkbox está marcado, agrega la orden al estado global
            if (isChecked) {
                state.push({ idOrden: id, name: name, pdf: pdf });
            } else {
                // Si el checkbox no está marcado, elimina la orden del estado global
                const index = state.findIndex(
                    (existingOrden) => existingOrden.idOrden === id
                );
                if (index !== -1) {
                    state.splice(index, 1);
                }
            }
        },
        resetOrdenes: (state) => {
            // Esta acción restablece el estado a su valor inicial (vacío en este caso)
            return [];
        },
    },
    extraReducers: (builder) => {
        // Manejar la acción asincrónica completada para la descarga de órdenes
        builder.addCase(downloadOrders.fulfilled, (state, action) => {
            // No es necesario realizar ninguna acción adicional aquí
        });
    },
});

export const { setOrdenesDownloadByChecked, resetOrdenes } = ordenes.actions;

export default ordenes.reducer;
