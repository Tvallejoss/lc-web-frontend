// Hooks
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";

// Styles
import classes from "./TablaMobile.module.css";

const ModalButtonsDerivaciones = ({ isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
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
                    <Link to="/excel">
                        <button>En lote</button>
                    </Link>
                    <Link to="/derivaciones">
                        <button> Individual</button>
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

export const TablaMobile = ({ data }) => {
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
            <div className={classes["search-tableMobile"]}>
                <input
                    placeholder="#1111"
                    className={classes["search-input"]}
                />
                <button className={classes["search-btn"]}>Buscar</button>
            </div>

            <div className={classes["cards-container"]}>
                {data.length ? (
                    data.map((derivacion, i) => {
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
                                        {derivacion.nombre !==
                                        "Derivacion Individual" ? (
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
                                        {derivacion.nombre !==
                                        "Derivacion Individual" ? (
                                            <p>Tipo: En Lote</p>
                                        ) : (
                                            <p>Tipo: Individual</p>
                                        )}

                                        <p>
                                            Estado: <span>En proceso</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <>No hay Derivaciones</>
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
