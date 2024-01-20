import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import config from "../../../../config";
import { decryptObj } from "../../../../utils/secure-data/decrypt";
import { encrypt } from "../../../../utils/secure-data/crypt";

import classes from "./CamposOrdenes.module.css";

export const CamposOrdenes = ({ derivacion, selectAll }) => {
    const [nobilisOrdenInfo, setNobilisOrdenInfo] = useState(null);
    const [pdfContent, setPdfContent] = useState(null);

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

                    const resultadoDecrypt = await decryptObj(data);
                    setNobilisOrdenInfo(resultadoDecrypt);

                    const pdfSrc = `data:application/pdf;base64,${resultadoDecrypt.pdfProtocol}`;
                    setPdfContent(pdfSrc);

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

    return (
        <ol className={classes["VALORES"]}>
            <li className={classes["CHECK"]}>
                <input type="checkbox" checked={selectAll} />
            </li>
            <li>{derivacion.fecha} 18/08/2023</li>
            <li>{derivacion.dni}</li>
            <li>{derivacion.nombre + " " + derivacion.apellido}</li>

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
                        <a
                            href={pdfContent}
                            download={
                                derivacion.nombre +
                                derivacion.apellido +
                                "-resultado-orden"
                            }
                        >
                            <img
                                src="https://cdn.discordapp.com/attachments/840217064978907170/1123256958196121620/icons8-descargar-64.png"
                                alt="download--v1"
                            />
                        </a>

                        <Link to={`/PDF_PACIENTE/${derivacion.idOrden}`}>
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
