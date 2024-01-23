// Hooks
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import JSZip from "jszip";
import axios from "axios";

// Config
import config from "../../../config";

// States
import { setOrdenesDownload, resetOrdenes } from "../../../state/ordenes";

// Utils
import { decryptAll } from "../../../utils/secure-data/decrypt";
import { encrypt } from "../../../utils/secure-data/crypt";
import { SyncLoader } from "react-spinners";

// Components
import { CamposOrdenes } from "./campos/CamposOrdenes";
import { TablaOrdenesMobile } from "../../mobile/dashOrdenes/TablaOrdenesMobile";
import { SearchInput } from "../../searchInput/SearchInput";

// Styles
import classes from "./TablaOrdenes.module.css";

const ModalCargando = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                width: "100%",
            }}
        >
            <div>
                <SyncLoader size={8} color={"#0b74d1"} loading={true} />
            </div>
        </div>
    );
};

export const TablaOrdenes = ({ id }) => {
    // Token user log
    const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
    // State global
    const ordenesActuales = useSelector((state) => state.ordenes);
    const dispatch = useDispatch();

    // Local States
    const [campos, setCampos] = useState([]);
    const [allCampos, setAllCampos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectAll, setSelectAll] = useState(false);

    // Params
    const { idDerivacion } = useParams();

    // eslint-disable-next-line
    const handleSelectAll = () => {
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        if (token) {
            const getOrdenes = async () => {
                try {
                    const { data } = await axios.post(
                        config.IP + config.PUERTO + "/ordenDerivacion",
                        {
                            token: token,
                            idDerivacion: await encrypt(
                                config.KEY,
                                idDerivacion
                            ),
                        },
                        {
                            headers: {
                                "Content-Type": "application/json", // Asegúrate de usar "application/json"
                            },
                        }
                    );
                    setCampos(await decryptAll(data));
                    setAllCampos(await decryptAll(data));
                } catch (error) {
                    console.log(
                        "Error Axios al traer las ordenes de una derivacion",
                        error
                    );
                    return error;
                } finally {
                    setLoading(false);
                }
            };
            setTimeout(getOrdenes, 1000);
        }
    }, [window.innerWidth]);

    //VIEW MOBILE
    if (window.innerWidth <= 1000) {
        return <TablaOrdenesMobile ordenes={campos} />;
    }

    // Descarga todas las ordenes posibles que marcaron en el Check
    const downloadAllPossibleOrders = async () => {
        if (ordenesActuales.length <= 0) {
            alert("No seleccionaste ninguna orden para descargar");
            return;
        }

        // Crear una instancia de JSZip
        const zip = new JSZip();

        // Agregar el contenido PDF al ZIP
        const agregarOrdenAlZIP = (orden) => {
            return new Promise((resolve) => {
                // Crear un nombre único para el archivo PDF
                const nombreArchivo = `#${
                    orden.idOrden + "-" + orden.name
                }.pdf`;

                // Convertir la cadena base64 a un blob
                const binaryPdf = atob(orden.pdf);
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

                resolve();
            });
        };

        // Descargar cada orden y agregarla al ZIP
        const descargas = ordenesActuales.map((orden) =>
            agregarOrdenAlZIP(orden)
        );

        try {
            // Esperar a que todas las descargas estén completas
            await Promise.all(descargas);

            // Generar el ZIP
            const blob = await zip.generateAsync({ type: "blob" });

            // Encryptar los ids
            const idsOrdenes = await Promise.all(
                ordenesActuales.map(async (orden) => {
                    return await encrypt(config.KEY, orden.idOrden);
                })
            );
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

            // Vaciar el stado global aca:
            dispatch(resetOrdenes());
        } catch (error) {
            // Vaciar el stado global aca:
            dispatch(resetOrdenes());
            alert("Error durante la descarga");
            console.error(
                "Error durante la descarga o la solicitud al backend:",
                error
            );
        }
    };

    return (
        <div className={classes["TABLA_DASH"]}>
            <div className={classes["TABLA_NAV"]}>
                <div className={classes["filtros"]}>
                    <img
                        src="https://cdn.discordapp.com/attachments/840217064978907170/1123256958196121620/icons8-descargar-64.png"
                        alt="download--v1"
                        onClick={downloadAllPossibleOrders}
                    />
                    <div className={classes["FILTROS"]}>
                        {/* <p>Filtrar</p> */}
                        <div>
                            <label>Filtrar por Archivos:</label>
                            <select name="filtroDescargas">
                                <option value="">Seleccionar</option>
                                <option value="1">Descargados</option>
                                <option value="0">No Descargados</option>
                            </select>
                        </div>

                        <div>
                            <label>Filtrar por Estado:</label>
                            <select name="filtroEstados">
                                <option value="">Seleccionar</option>
                                <option value="P">En Proceso</option>
                                <option value="C">Finalizados</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className={classes["busqueda"]}>
                    <div className={classes["BOTONES"]}>
                        <button className={classes["APLICAR"]}>
                            Aplicar Filtros
                        </button>
                        <button className={classes["BORRAR"]}>
                            Borrar Filtros
                        </button>
                    </div>
                    {/* Input search general */}
                    <SearchInput
                        setCampos={setCampos}
                        allCampos={allCampos}
                        selectOptions={["idOrden", "nombre", "apellido", "dni"]}
                    />
                </div>
            </div>

            <div className={classes["TABLE"]}>
                <div className={classes["TABLA_D"]}>
                    <ol className={classes["Campos"]}>
                        <li className={classes["download-text"]}>
                            <input type="checkbox" disabled={true} />
                        </li>
                        <li>Fecha</li>
                        <li>DNI</li>
                        <li>paciente</li>
                        <li>Estado</li>
                        <li>Acciones</li>
                    </ol>

                    {loading ? (
                        <ModalCargando />
                    ) : campos.length ? (
                        campos.map((field, i) => {
                            return (
                                <CamposOrdenes
                                    orden={field}
                                    setLoading={setLoading}
                                    key={i}
                                />
                            );
                        })
                    ) : (
                        <>Error al traer las ordenes </>
                    )}
                </div>
            </div>
            <div className={classes["boton_ordenes"]}>
                <Link to="/dashboard">
                    <button>VOLVER</button>
                </Link>
            </div>
        </div>
    );
};
