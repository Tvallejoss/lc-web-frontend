// Hooks
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";

// Styles
import classes from "./TablaMobile.module.css";

// Icons
import { IconUser, IconUsers } from "../../../assets/icons";

// Components
import { SearchInputMobile } from "../../searchInput/SearchInput";
import { ModalCargando } from "../../modalCargando/ModalCargando";

const ModalButtonsDerivaciones = ({ isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            ariaHideApp={false}
            onRequestClose={onClose}
            style={{
                overlay: {
                    width: "100%",
                    zIndex: 10,
                },
                content: {
                    width: "70%",
                    height: "150px",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                },
            }}
        >
            <div className={classes["modal-derivaciones"]}>
                <div className={classes["BOTONES_MODAL"]}>
                    <Link to="/derivaciones">
                        <button>
                            {" "}
                            <IconUser />
                            Individual
                        </button>
                    </Link>
                    <Link to="/excel">
                        <button>
                            {" "}
                            <IconUsers /> En lote
                        </button>
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

export const TablaMobile = ({ allCampos, setLoading, loading }) => {
    // Campos State
    const [campos, setCampos] = useState([]);
    useEffect(() => {
        setCampos(allCampos);
    }, [allCampos]);

    //Modal Functions
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    const handleModalButton = () => {
        setIsConfirmationOpen(true);
    };

    // eslint-disable-next-line
    const handleConfigModal = () => {
        setIsConfirmationOpen(false);
    };

    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false);
    };

    return (
        <div className={classes["tableMobile-container"]}>
            <SearchInputMobile
                setCampos={setCampos}
                allCampos={allCampos}
                selectOptions={["id"]}
            />

            <div className={classes["cards-container"]}>
                {loading ? (
                    <ModalCargando />
                ) : campos.length ? (
                    campos.map((derivacion, i) => {
                        return (
                            <Link
                                to={"/dashboard/" + derivacion.id}
                                key={i}
                                className={classes["card"]}
                            >
                                <div>
                                    <div className={classes["card-info-top"]}>
                                        <p>#{derivacion.id}</p>

                                        <p>{derivacion.fechaEmision}</p>
                                    </div>

                                    <div>
                                        {derivacion.tipo !==
                                        "INDIVIDUAL" ? (
                                            <h6>
                                                {" "}
                                                <strong>
                                                    Nombre Excel
                                                </strong>: {derivacion.nombre}
                                            </h6>
                                        ) : (
                                            <h6>
                                                {" "}
                                                <strong></strong>{" "}
                                                {derivacion.nombre}
                                            </h6>
                                        )}
                                    </div>

                                    <div
                                        className={classes["card-info-bottom"]}
                                    >
                                        {derivacion.tipo !==
                                        "INDIVIDUAL" ? (
                                            <p>Tipo: En Lote</p>
                                        ) : (
                                            <p>Tipo: Individual</p>
                                        )}

                                        <p>
                                            <span>-----</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <p className={classes["not-found-msg"]}>
                        No se encuentran derivaciones
                    </p>
                )}
            </div>

            <div className={classes["button-new-derivacion"]}>
                <button onClick={handleModalButton}>Nueva Derivacion</button>
            </div>

            <ModalButtonsDerivaciones
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
            />
        </div>
    );
};
