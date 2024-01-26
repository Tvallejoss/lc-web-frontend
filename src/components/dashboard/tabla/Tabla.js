//Components
import { SyncLoader } from "react-spinners";
import { Campos } from "./campos/Campos";
import { TablaMobile } from "../../mobile/dashDerivaciones/TablaMobile";
import { SearchInput } from "../../searchInput/SearchInput";

//Hooks
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config";
import { decryptAll } from "../../../utils/secure-data/decrypt";
import { useDispatch } from "react-redux";
import { resetOrdenes } from "../../../state/ordenes";

//Styles
import classes from "./Tabla.module.css";

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

export const Tabla = () => {
    const dispatch = useDispatch();

    // Campos State
    const [campos, setCampos] = useState([]);
    const [allCampos, setAllCampos] = useState([]);

    // Loading State
    const [loading, setLoading] = useState(true);

    // Filtro fechas States
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const fechaDesdeValue = (e) => {
        setFechaDesde(e.target.value);
    };

    const fechaHastaValue = (e) => {
        setFechaHasta(e.target.value);
    };

    const filterFechas = () => {
        if (fechaDesde === "" || fechaHasta === "")
            return alert("Filtros Incompletos");

        const fechaDesdeObj = new Date(fechaDesde);
        const fechaHastaObj = new Date(fechaHasta);

        const resultadosFiltrados = campos.filter((item) => {
            const fechaItem = new Date(item.fechaEmision);
            return fechaItem >= fechaDesdeObj && fechaItem <= fechaHastaObj;
        });
        setCampos(resultadosFiltrados);
    };

    const resetearFiltro = () => {
        setCampos(allCampos);
        setFechaDesde("");
        setFechaHasta("");
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));

        if (token) {
            const getOrigenes = async () => {
                try {
                    const { data } = await axios.post(
                        config.IP + config.PUERTO + "/derivaciones",
                        {
                            token: token,
                        }
                    );

                    dispatch(resetOrdenes());
                    setCampos(await decryptAll(data));
                    setAllCampos(await decryptAll(data));
                } catch (error) {
                    console.log("Error Axios al traer las derivaciones", error);
                    return error;
                } finally {
                    setLoading(false);
                }
            };
            setTimeout(getOrigenes, 1000);
        }
    }, [window.innerWidth]);

    //VIEW MOBILE
    if (window.innerWidth <= 1000) return <TablaMobile allCampos={allCampos} />;

    return (
        <div className={classes["TABLA_DASH"]}>
            <div className={classes["TABLA_NAV"]}>
                <div className={classes["filtros"]}>
                    <div className={classes["FILTROS"]}>
                        <p>Filtrar</p>
                        <div>
                            <label>Fecha desde</label>
                            <input type="date" onChange={fechaDesdeValue} />
                        </div>

                        <div>
                            <label>Fecha hasta</label>
                            <input type="date" onChange={fechaHastaValue} />
                        </div>
                    </div>
                </div>
                <div className={classes["busqueda"]}>
                    <div className={classes["BOTONES"]}>
                        <button
                            className={classes["APLICAR"]}
                            onClick={filterFechas}
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

                    <div className={classes["search"]}>
                        <SearchInput
                            setCampos={setCampos}
                            allCampos={allCampos}
                            selectOptions={["id", "nombre"]}
                        />
                    </div>
                </div>
            </div>

            <div className={classes["TABLE"]}>
                <div className={classes["TABLA_D"]}>
                    <ol className={classes["Campos"]}>
                        <li>Fecha</li>
                        <li>Derivacion</li>
                        <li>Nombre</li>
                        <li>###</li>
                    </ol>

                    {loading ? (
                        <ModalCargando />
                    ) : campos.length ? (
                        campos.map((field, i) => {
                            return (
                                <Campos
                                    derivacion={field}
                                    setLoading={setLoading}
                                    key={i}
                                />
                            );
                        })
                    ) : (
                        <>No se encuentran derivaciones</>
                    )}
                </div>
            </div>
        </div>
    );
};
