// Hooks
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import JSZip from "jszip";
import axios from "axios";

// Config
import config from "../../../config";

// Icons
import { IconDownload } from "../../../assets/icons/";

// States
import { downloadOrders, resetOrdenes } from "../../../state/ordenes";

// Utils
import { decryptAll, decryptObj } from "../../../utils/secure-data/decrypt";
import { encrypt } from "../../../utils/secure-data/crypt";
import { SyncLoader } from "react-spinners";
import { downloadAllOrders } from "../../../utils/files/downloadFiles/downloadPdf";

// Components
import { CamposOrdenes } from "./campos/CamposOrdenes";
import { TablaOrdenesMobile } from "../../mobile/dashOrdenes/TablaOrdenesMobile";
import { SearchInput } from "../../searchInput/SearchInput";
import { ModalCargando } from "../../modalCargando/ModalCargando";

// Styles
import classes from "./TablaOrdenes.module.css";

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

    // Filtro Descargas y Estados
    const [filtroDescargas, setFiltroDescarga] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");

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

                    const dataDecrypt = await decryptAll(data);

                    dataDecrypt.map((order) => {
                        const getEstadoByOrden = async () => {
                            try {
                                const { data } = await axios.post(
                                    config.IP +
                                        config.PUERTO +
                                        "/resultadoByOrden",
                                    {
                                        token: token,
                                        idOrden: await encrypt(
                                            config.KEY,
                                            order.idOrden
                                        ),
                                    }
                                );

                                const resultadoDecrypt = await decryptObj(data);
                                const pdfSrc = `data:application/pdf;base64,${resultadoDecrypt.pdfProtocol}`;

                                setCampos((prevCampos) => [
                                    ...prevCampos,
                                    {
                                        ...order,
                                        pdfSrc: pdfSrc,
                                        estado: resultadoDecrypt.estado,
                                    },
                                ]);

                                setAllCampos((prevCampos) => [
                                    ...prevCampos,
                                    {
                                        ...order,
                                        pdfSrc: pdfSrc,
                                        estado: resultadoDecrypt.estado,
                                    },
                                ]);
                            } catch (error) {
                                console.log(
                                    "Error Axios al traer el estado de la orden ID#",
                                    order.idOrden,
                                    error
                                );
                                return error;
                            }
                        };

                        getEstadoByOrden();
                    });
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
    }, []);

    //VIEW MOBILE
    if (window.innerWidth <= 1000) {
        return (
            <TablaOrdenesMobile
                ordenes={campos}
                setLoading={setLoading}
                loading={loading}
            />
        );
    }

    // Descarga todas las ordenes posibles que marcaron en el Check
    const downloadAllPossibleOrders = () => {
        if (ordenesActuales.length <= 0) {
            if (campos.length <= 0) {
                alert("No hay ninguna orden para descargar");
                return;
            }
            downloadAllOrders(campos);
            return;
        }
        // Despacha la acción asincrónica con las órdenes marcadas
        dispatch(downloadOrders(ordenesActuales));
    };

    const filtros = () => {
        // Si ambos filtros están vacíos, mostrar mensaje o manejar según tus necesidades
        if (filtroDescargas === "" && filtroEstado === "") {
            return alert("Filtros Incompletos");
        }

        // Filtrar según el estado de descarga y el estado de la orden
        const resultadosFiltrados = allCampos.filter((item) => {
            const cumpleFiltroDescargas =
                filtroDescargas === "" ||
                filtroDescargas === item.flag_Download;
            const cumpleFiltroEstado =
                filtroEstado === "" || filtroEstado === item.estado;

            return cumpleFiltroDescargas && cumpleFiltroEstado;
        });

        // Actualizar el estado de campos con los resultados filtrados
        setCampos(resultadosFiltrados);
    };

    const resetearFiltro = () => {
        setCampos(allCampos);
        setFiltroDescarga("");
        setFiltroEstado("");

        //marcar opcion principal
        document.getElementById("filtroDescargas").selectedIndex = 0;
        document.getElementById("filtroEstados").selectedIndex = 0;
    };

    const handleDescargasChange = (e) => {
        setFiltroDescarga(e.target.value);
    };

    const handleEstadoChange = (e) => {
        setFiltroEstado(e.target.value);
    };

    return (
        <div className={classes["TABLA_DASH"]}>
            <div className={classes["TABLA_NAV"]}>
                <div className={classes["filtros"]}>
                    <IconDownload onClick={downloadAllPossibleOrders} />
                    <div className={classes["FILTROS"]}>
                        {/* <p>Filtrar</p> */}
                        <div>
                            <label>Filtrar por Archivos:</label>
                            <select
                                id="filtroDescargas"
                                name="filtroDescargas"
                                onChange={handleDescargasChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="1">Descargados</option>
                                <option value="0">No Descargados</option>
                            </select>
                        </div>

                        <div>
                            <label>Filtrar por Estado:</label>
                            <select
                                id="filtroEstados"
                                name="filtroEstados"
                                onChange={handleEstadoChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="P">En Proceso</option>
                                <option value="C">Finalizados</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className={classes["busqueda"]}>
                    <div className={classes["BOTONES"]}>
                        <button
                            className={classes["APLICAR"]}
                            onClick={filtros}
                        >
                            Aplicar Filtros
                        </button>
                        <button
                            className={classes["BORRAR"]}
                            onClick={resetearFiltro}
                        >
                            Borrar Filtros
                        </button>
                    </div>
                    {/* Input search general */}

                    <div className={classes["search"]}>
                        <SearchInput
                            setCampos={setCampos}
                            allCampos={allCampos}
                            selectOptions={[
                                "idOrden",
                                "nombre",
                                "apellido",
                                "dni",
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className={classes["TABLE"]}>
                <div className={classes["TABLA_D"]}>
                    <ol className={classes["Campos"]}>
                        <li>Descargar</li>
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
                        <p className={classes["not-found-msg"]}>
                            {" "}
                            No se encuentran ordenes{" "}
                        </p>
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
