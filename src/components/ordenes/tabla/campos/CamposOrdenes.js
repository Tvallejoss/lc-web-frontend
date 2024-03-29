import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import config from "../../../../config";
import { decryptObj } from "../../../../utils/secure-data/decrypt";
import { encrypt } from "../../../../utils/secure-data/crypt";
import pako from "pako";

import classes from "./CamposOrdenes.module.css";

export const CamposOrdenes = ({ derivacion, selectAll }) => {
    const [pdfComprimido, setPdfComprimido] = useState();
    const [nobilisOrdenInfo, setNobilisOrdenInfo] = useState(null);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));

        if (token) {
            const getEstadoByOrden = async () => {
                try {
                    const { data } = await axios.post(
                        config.IP + config.PUERTO + "/resultadoByOrden",
                        {
                            token: token,
                            idOrden: await encrypt(
                                config.KEY,
                                derivacion.idOrden
                            ),
                        }
                    );

                    setNobilisOrdenInfo(await decryptObj(data));
                } catch (error) {
                    console.log(
                        "Error Axios al traer el estado de la orden en Desktop",
                        error
                    );
                    return error;
                }
            };
            getEstadoByOrden();
        }
    }, []);

    useEffect(() => {
        // Comprime el PDF
        if (nobilisOrdenInfo) {
            const pdfToCompress = nobilisOrdenInfo.pdfProtocol || "";
            const compressedPdf = pako.deflate(pdfToCompress, { to: "string" });
            setPdfComprimido(compressedPdf);
        }
    }, [nobilisOrdenInfo]);


    return (
        <ol className={classes["VALORES"]}>
            <li className={classes["CHECK"]}>
                <input type="checkbox" checked={selectAll} />
            </li>
            <li>{derivacion.fecha} 18/08/2023</li>
            <li>{derivacion.dni}</li>
            <li>{derivacion.nombre + derivacion.apellido}</li>

            {nobilisOrdenInfo ? (
                nobilisOrdenInfo.estado ? (
                    <li className={classes["VERDE"]}>
                        {nobilisOrdenInfo.estado === "C"
                            ? "Finalizado"
                            : "En proceso"}
                    </li>
                ) : (
                    <li className={classes["ROJO"]}>Nobilis Error</li>
                )
            ) : (
                <li className={classes["ROJO"]}>Nobilis Error</li>
            )}

            {nobilisOrdenInfo ? (
                nobilisOrdenInfo.estado === "C" ? (
                    <li className={classes["acciones-ordenes"]}>
                        <img
                            src="https://cdn.discordapp.com/attachments/840217064978907170/1123256958196121620/icons8-descargar-64.png"
                            alt="download--v1"
                        />

                        <Link
                            to={`/PDF_PACIENTE/${encodeURIComponent(
                                pdfComprimido
                            )}`}
                        >
                            <img
                                src="https://cdn.discordapp.com/attachments/1095387607409635330/1124328592143294554/icons8-ver-48.png"
                                alt="download--v1"
                            />
                        </Link>
                    </li>
                ) : (
                    <li className={classes["DISABLE"]}>No disponible</li>
                )
            ) : (
                <li className={classes["DISABLE"]}>No disponible</li>
            )}
        </ol>
    );
};
