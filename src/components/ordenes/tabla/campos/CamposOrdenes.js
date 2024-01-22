// Hooks
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

// States
import { setOrdenesDownload } from "../../../../state/ordenes";

// Config
import config from "../../../../config";
import { decryptObj } from "../../../../utils/secure-data/decrypt";
import { encrypt } from "../../../../utils/secure-data/crypt";

// Styles
import classes from "./CamposOrdenes.module.css";

export const CamposOrdenes = ({ orden, selectAll }) => {
  // Obtén el estado actual de las órdenes desde el store
  const [isChecked, setIsChecked] = useState(false);
  const ordenesActuales = useSelector((state) => state.ordenes);

    // User log
    const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));

    // Local States
    const [nobilisOrdenInfo, setNobilisOrdenInfo] = useState(null);
    const [pdfContent, setPdfContent] = useState(null);

    // Hooks
    const dispatch = useDispatch();

    console.log("ORDEN", orden);
    useEffect(() => {
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
                        "Error Axios al traer el estado de la orden en Desktop",
                        error
                    );
                    return error;
                }
            };
            getEstadoByOrden();
        }
    }, []);

    const downloadFileAndUpdateStatus = async () => {
        // Ruta: /actualizarFlagDescargaOrden

        // dispatch(setOrdenesDownload(nuevasOrdenes));

        const downloadFile = (msg) => {
            const link = document.createElement("a");
            link.href = pdfContent;
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

            // Descargar igual para no perder funcionalidad (indicando en el pdf-name)
            downloadFile("Error-flag");
            return error;
        }
    };

  
    // console.log("ORDENES ACTUALES", ordenesActuales);
    useEffect(() => {
        //actualizar el estado global de las órdenes
        dispatch(
            setOrdenesDownload({
                id: orden.idOrden,
                pdfContent: nobilisOrdenInfo?.pdfProtocol,
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
            <li className={classes["CHECK"]}>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onClick={handleCheckboxChange}
                    disabled={
                        orden?.flag_Download === "0" && nobilisOrdenInfo?.estado
                            ? false
                            : true
                    }
                />
            </li>
            <li>{orden.fecha} 18/08/2023</li>
            <li>{orden.dni}</li>
            <li>{orden.nombre + " " + orden.apellido}</li>

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
