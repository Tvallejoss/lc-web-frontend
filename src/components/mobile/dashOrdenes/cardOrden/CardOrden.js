// Hooks
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Styles
import classes from "./CardOrden.module.css";

// Icons
import { IconDownloadSmall, IconEye } from "../../../../assets/icons";

// Config
import config from "../../../../config";
import { decryptObj } from "../../../../utils/secure-data/decrypt";
import { encrypt } from "../../../../utils/secure-data/crypt";

export const CardOrden = ({ orden }) => {
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
                            idOrden: await encrypt(config.KEY, orden.idOrden),
                        }
                    );

                    const resultadoDecrypt = await decryptObj(data);
                    setNobilisOrdenInfo(resultadoDecrypt);

                    const pdfSrc = `data:application/pdf;base64,${resultadoDecrypt.pdfProtocol}`;
                    setPdfContent(pdfSrc);
                    setNobilisOrdenInfo(await decryptObj(data));
                } catch (error) {
                    console.log(
                        "Error Axios al traer el estado de la orden en Mobile",
                        error
                    );
                    return error;
                }
            };
            getEstadoByOrden();
        }
    }, []);

    return (
        <div to={"/dashboard/" + orden.id} className={classes["card"]}>
            <div>
                <div className={classes["card-info-top"]}>
                    <p>#{orden.idOrden}</p>

                    {nobilisOrdenInfo ? (
                        nobilisOrdenInfo.estado === "C" ? (
                            <div className={classes["card-imagenes"]}>
                                <a
                                    href={pdfContent}
                                    download={
                                        orden.nombre +
                                        orden.apellido +
                                        "-resultado-orden"
                                    }
                                >
                                    <IconDownloadSmall />
                                </a>
                                <Link to={`/PDF_PACIENTE/${orden.idOrden}`}>
                                    <IconEye />
                                </Link>
                            </div>
                        ) : (
                            <li className={classes["DISABLE"]}>
                                No disponible
                            </li>
                        )
                    ) : (
                        ""
                    )}
                </div>

                <div>
                    <h6>
                        {" "}
                        <strong>Nombre: </strong>:{" "}
                        {orden.nombre + " " + orden.apellido}
                    </h6>
                </div>

                <div className={classes["card-info-bottom"]}>
                    <p>Tipo: Individual</p>

                    {nobilisOrdenInfo ? (
                        nobilisOrdenInfo.estado ? (
                            <p>
                                Estado:{" "}
                                {nobilisOrdenInfo.estado === "C" ? (
                                    <span className={classes["VERDE"]}>
                                        Finalizada
                                    </span>
                                ) : (
                                    <span className={classes["PENDIENTE"]}>
                                        En proceso
                                    </span>
                                )}
                            </p>
                        ) : (
                            <p>
                                Estado:{" "}
                                <span className={classes["ROJO"]}>
                                    Nobilis Error
                                </span>
                            </p>
                        )
                    ) : (
                        <p>
                            Estado:{" "}
                            <span className={classes["PENDIENTE"]}>
                                Cargando...
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
