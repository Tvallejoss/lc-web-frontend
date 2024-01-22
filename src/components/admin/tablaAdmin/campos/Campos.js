
// Hooks 
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../../../config";
import { ModalEstado } from "./ModalEstado";
import { useDispatch } from "react-redux";
import { setClientData } from "../../../../state/clientSlice";
import { encrypt } from "../../../../utils/secure-data/crypt";


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
        <ol className={classes['VALORES_ADMIN']}>
            <li>{cliente.cuit}</li>
            <li>
                {cliente.estado === "0" ? (
                    <>
                        <img
                            src="https://cdn.discordapp.com/attachments/1095387607409635330/1135313104427831346/image.png"
                            alt="X"
                            onClick={handleEstado}
                        />
                    </>
                ) : (
                    <>
                        <img
                            src="https://cdn.discordapp.com/attachments/1095387607409635330/1130057093982978088/Captura_de_pantalla_2023-07-16_054316.png"
                            alt="V"
                            onClick={handleEstado}
                        />
                    </>
                )}
            </li>
            <li>{cliente.usernameDeUsuario}</li>
            <li>{cliente.razonSocial}</li>
            <li>{cliente.mail}</li>
            <li>
                <img
                    src="https://cdn.discordapp.com/attachments/1095387607409635330/1130054412287606784/Captura_de_pantalla_2023-07-16_053228.png"
                    alt="download--v1"
                />

                <Link to={"/cliente/" + cliente.cuit} onClick={handleLinkClick}>
                    <img
                        src="https://cdn.discordapp.com/attachments/1095387607409635330/1130053992769130537/Captura_de_pantalla_2023-07-16_053043.png"
                        alt="download--v1"
                    />
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
