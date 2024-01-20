// Hooks
import React, { useState, useEffect } from "react";
import { logOut } from "../../utils/auth/logOut";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

// Config
import config from "../../config";

// Components
import { LogOut } from "../logOut/LogOut";

// Styles
import classes from "./Sidebar.module.css";

export const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Modal Functions
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const handleLogout = () => {
        setIsConfirmationOpen(true);
    };
    const handleConfirmLogout = () => {
        logOut(dispatch, navigate);
        setIsConfirmationOpen(false);
    };
    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false);
    };

    //PDF
    const [pdfBase64, setpdfBase64] = useState("");
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
        axios
            .post(config.IP + config.PUERTO + "/getPDFInstructive", {
                token: token,
            })
            .then(({ data }) => {
                setpdfBase64(data);
            })
            .catch((error) => {
                console.error("Error al obtener el PDF", error);
            });
    }, []);

    //Excel
    const [excelBase64, setExcelBase64] = useState("");
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
        axios
            .post(config.IP + config.PUERTO + "/getExcelTemplate", {
                token: token,
            })
            .then(({ data }) => {
                setExcelBase64(data);
            })
            .catch((error) => {
                console.error("Error al obtener el Excel", error);
            });
    }, []);

    return (
        <aside className={classes["sidebar_home"]}>
            <ul>
                <Link to="/dashboard">
                    <li>Derivaciones</li>{" "}
                </Link>
                <li>
                    {excelBase64 ? (
                        <a href={excelBase64} download="modelo-excel-{#NOMBRE}">
                            Descargar Modelo
                        </a>
                    ) : (
                        <p> Descargar Modelo</p>
                    )}
                </li>
                <li>
                    {pdfBase64 ? (
                        <a href={pdfBase64} download="Instructivo-de-uso">
                            Ver Instructivo
                        </a>
                    ) : (
                        <p> Ver Instructivo</p>
                    )}
                </li>
                <Link to="/user">
                    {" "}
                    <li>Mis Datos</li>{" "}
                </Link>
                <li onClick={handleLogout}>Salir</li>
            </ul>

            <LogOut
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmLogout}
            />
        </aside>
    );
};
