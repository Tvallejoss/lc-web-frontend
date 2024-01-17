import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Campos.css";
import config from "../../../../config";
import { ModalEstado } from "./ModalEstado";
import { useDispatch } from "react-redux";
import { setClientData } from "../../../../state/clientSlice";
import { encrypt } from "../../../../utils/secure-data/crypt";

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
                console.log("EL ESTADO SE CAMBIO CORRECTAMENTE");
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
        <tr className="VALORES_ADMIN">
            <td>{cliente.cuit}</td>
            <td>
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
            </td>
            <td>{cliente.usernameDeUsuario}</td>
            <td>{cliente.razonSocial}</td>
            <td>{cliente.mail}</td>
            <td>
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
            </td>

            <ModalEstado
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmEstado}
            />
        </tr>
    );
};
