// Hooks
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

// States
import { setOrdenesDownloadByChecked } from "../../../../state/ordenes";

// Config
import config from "../../../../config";
import { decryptObj } from "../../../../utils/secure-data/decrypt";
import { encrypt } from "../../../../utils/secure-data/crypt";

// Styles
import classes from "./CamposOrdenes.module.css";

export const CamposOrdenes = ({ orden, selectAll }) => {
    const dispatch = useDispatch();

    // User log
    const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
    // Obtén el estado actual de las órdenes desde el store
    const [isChecked, setIsChecked] = useState(false);
    const ordenesActuales = useSelector((state) => state.ordenes);

    // Descargar y actualizar estado de un archivo solo
    const downloadFileAndUpdateStatus = async () => {
        const downloadFile = (msg) => {
            const link = document.createElement("a");
            link.href = orden.pdfSrc;
            link.download =
                orden.nombre + orden.apellido + "-resultado-orden" + msg;
            link.click();
        };

        try {
            await axios.post(
                config.IP + config.PUERTO + "/actualizarFlagDescargaOrden",
                {
                    token: token,
                    idOrdenes: [await encrypt(config.KEY, orden.idOrden)],
                }
            );
            downloadFile("FlagUpdate");
        } catch (error) {
            console.log("Error Axios al cambiar el Flag ", error);
            return error;
        }
    };

    useEffect(() => {
        //actualizar el estado global de las órdenes cuando cambia el estado de un checkbox
        dispatch(
            setOrdenesDownloadByChecked({
                id: orden.idOrden,
                name: orden.nombre + orden.apellido,
                pdf: orden?.pdfSrc,
                isChecked,
            })
        );
    }, [isChecked]);

    // Manejador de cambio para el checkbox
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <ol className={classes["VALORES"]}>
            <li>
                <input
                    className={classes["CHECK"]}
                    type="checkbox"
                    defaultChecked={isChecked}
                    onClick={handleCheckboxChange}
                    disabled={orden?.estado ? false : true}
                />
            </li>
            <li>{orden.fecha} 18/08/2023</li>
            <li>{orden.dni}</li>
            <li>{orden.nombre + " " + orden.apellido}</li>

            {orden ? (
                orden.estado ? (
                    <li className={classes["VERDE"]}>
                        {orden.estado === "C" ? "Finalizado" : "En proceso"}
                    </li>
                ) : (
                    <li className={classes["ROJO"]}>Nobilis Error</li>
                )
            ) : (
                <li className={classes["ROJO"]}>Nobilis Error</li>
            )}

            {orden ? (
                orden.estado === "C" ? (
                    <li className={classes["acciones-ordenes"]}>
                        <img
                            src="https://cdn.discordapp.com/attachments/840217064978907170/1123256958196121620/icons8-descargar-64.png"
                            alt="download--v1"
                            onClick={downloadFileAndUpdateStatus}
                        />

                        <Link to={`/PDF_PACIENTE/${orden.idOrden}`}>
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
