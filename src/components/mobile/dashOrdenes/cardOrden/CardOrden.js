// Hooks
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import pako from "pako";

// Styles
import classes from "./CardOrden.module.css";

// States
// import { setPdfByOrdenSelected } from "../../../../state/pdfByOrdenSelected";
// import { useDispatch } from "react-redux";

// Config
import config from "../../../../config";
import { decryptObj } from "../../../../utils/secure-data/decrypt";
import { encrypt } from "../../../../utils/secure-data/crypt";

export const CardOrden = ({ orden }) => {
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
                            idOrden: await encrypt(config.KEY, orden.idOrden),
                        }
                    );
                    // dispatch(setPdfByOrdenSelected(await decryptObj(data)));
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

    useEffect(() => {
        // Comprime el PDF
        if (nobilisOrdenInfo) {
            const pdfToCompress = nobilisOrdenInfo.pdfProtocol || "";
            const compressedPdf = pako.deflate(pdfToCompress, { to: "string" });
            setPdfComprimido(compressedPdf);
        }
    }, [nobilisOrdenInfo]);

    return (
        <div to={"/dashboard/" + orden.id} className={classes["card"]}>
            <div>
                <div className={classes["card-info-top"]}>
                    <p>#{orden.id}</p>

                    {nobilisOrdenInfo ? (
                        nobilisOrdenInfo.estado === "C" ? (
                            <div className={classes["card-imagenes"]}>
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
                        {orden.nombre + orden.apellido}
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
                            <span className={classes["ROJO"]}>
                                Nobilis Error
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
