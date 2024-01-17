// Hooks
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

// Config
import config from "../../../config";

// Utils
import { decryptAll } from "../../../utils/secure-data/decrypt";
import { encrypt } from "../../../utils/secure-data/crypt";
import { SyncLoader } from "react-spinners";

// Components
import { CamposOrdenes } from "./campos/CamposOrdenes";
import { TablaOrdenesMobile } from "../../mobile/dashOrdenes/TablaOrdenesMobile";

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
    const [campos, setCampos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectAll, setSelectAll] = useState(false);

    const { idDerivacion } = useParams();

    // eslint-disable-next-line
    const handleSelectAll = () => {
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));

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

    return (
        <div className={classes["TABLA_DASH"]}>
            <div className={classes["TABLA_NAV"]}>
                <div className={classes["filtros"]}>
                    <img
                        src="https://cdn.discordapp.com/attachments/840217064978907170/1123256958196121620/icons8-descargar-64.png"
                        alt="download--v1"
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

                    <div className={classes["INPUT"]}>
                        <input placeholder="Buscar" />
                    </div>
                </div>
            </div>

            <div className={classes["TABLE"]}>
                <div className={classes["TABLA_D"]}>
                    <ol className={classes["Campos"]}>
                        <li className={classes["download-text"]}>
                            <input type="checkbox" />
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
                                    derivacion={field}
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
