// Hooks
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Styles
import classes from "./CardAdmin.module.css";

// Icons
import { IconEdit, IconCheck, IconX } from "../../../../assets/icons";

// Config
import config from "../../../../config";
import { decryptObj } from "../../../../utils/secure-data/decrypt";
import { encrypt } from "../../../../utils/secure-data/crypt";

// Components
import { ModalEstado } from "../../../admin/tablaAdmin/campos/ModalEstado";

export const CardAdmin = ({ origen }) => {
    //Modal Functions
    const [estado, setEstado] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    const handleEstado = () => {
        setIsConfirmationOpen(true);
    };

    const handleConfirmEstado = async () => {
        const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
        axios
            .post(config.IP + config.PUERTO + "/origenChangeState", {
                token: token,
                cuit: await encrypt(config.KEY, origen.cuit),
            })
            .then(({ data }) => {
                setEstado(true);
                setLoading(true);
            })
            .catch((error) => {
                console.log("Error al cambiar el estado", error);
            });

        setIsConfirmationOpen(false);
    };

    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false);
    };

    return (
        <div className={classes["card"]}>
            <div className={classes["card-info-top"]}>
                <p>Cuit: {origen.cuit}</p>

                <div className={classes["acciones"]}>
                    {origen.estado === "0" ? (
                        <>
                            <div className={classes["estados"]}>
                                <p>Estado:</p>
                                <IconX onClick={handleEstado} />
                            </div>

                            <Link to={"/cliente/" + origen.cuit}>
                                <p>Modificar Origen: </p>
                                <IconEdit />
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className={classes["estados"]}>
                                <p>Estado: </p>
                                <IconCheck onClick={handleEstado} />
                            </div>
                            <Link to={"/cliente/" + origen.cuit}>
                                <p>Modificar Origen:</p>
                                <IconEdit />
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div>
                <h6>{origen.usernameDeUsuario}</h6>

                <p>{origen.mail}</p>
            </div>

            <div className={classes["card-info-bottom"]}>
                <p>
                    Razon Social: <span>{origen.razonSocial}</span>
                </p>
            </div>
            <ModalEstado
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmEstado}
            />
        </div>
    );
};
