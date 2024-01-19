// Hooks
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";

// Styles
import classes from "./TablaMobile.module.css";

// Components
import { SearchInputMobile } from "../../searchInput/SearchInput";

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

export const TablaMobile = ({ allCampos }) => {
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
                {campos.length ? (
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
