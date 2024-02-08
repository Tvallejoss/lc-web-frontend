// Hooks
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setClientData } from "../../../../state/clientSlice";
import { encrypt } from "../../../../utils/secure-data/crypt";

// Config
import config from "../../../../config";

// Icons
import { IconEdit, IconEye, IconCheck, IconX } from "../../../../assets/icons";

// Components
import { ModalEstado } from "./ModalEstado";

// Styles
import classes from "./Campos.module.css";

export const Campos = ({ cliente, setEstado, setLoading }) => {
    const dispatch = useDispatch();

    const handleLinkClick = () => {
        dispatch(setClientData(cliente));
    };

    //Modal Functions
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const handleEstado = () => {
        setIsConfirmationOpen(true);
    };

    const handleConfirmEstado = async () => {
        const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
        axios
            .post(config.IP + config.PUERTO + "/origenChangeState", {
                token: token,
                cuit: await encrypt(config.KEY, cliente.cuit),
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
        <ol className={classes["VALORES_ADMIN"]}>
            <li>{cliente.cuit}</li>
            <li>
                {cliente.estado === "0" ? (
                    <>
                        <IconX
                            onClick={handleEstado}
                        />
                    </>
                ) : (
                    <>
                        <IconCheck
                            onClick={handleEstado}
                        />
                    </>
                )}
            </li>
            <li>{cliente.usernameDeUsuario}</li>
            <li>{cliente.razonSocial}</li>
            <li>{cliente.mail}</li>
            <li>
                <Link to={"/cliente/" + cliente.cuit} onClick={handleLinkClick}>
                    <IconEdit />
                </Link>
            </li>

            <ModalEstado
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmEstado}
            />
        </ol>
    );
};
