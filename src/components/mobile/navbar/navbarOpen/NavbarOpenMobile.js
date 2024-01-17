// Hooks
import React, { useState, useEffect } from "react";
import { logOut } from "../../../../utils/auth/logOut";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

// Config
import config from "../../../../config";

// Components
import { LogOut } from "../../../logOut/LogOut";

// Styles
import classes from "./NavbarOpenMobile.module.css";

export const NavbarOpenMobile = ({ closeNavbar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Modal Functions
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const handleLogout = () => {
        document.documentElement.style.overflow = "auto";
        document.body.scroll = "yes";
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
        <div className={classes["navbar-options"]}>
            <div className={classes["navbar-option"]}>
                {" "}
                <Link to="/dashboard" onClick={() => closeNavbar()}>
                    Derivaciones{" "}
                </Link>
            </div>
            <div className={classes["navbar-option"]}>
                {excelBase64 ? (
                    <a href={excelBase64} download>
                        Descarg Modelo
                    </a>
                ) : (
                    <p> Descargar Modelo</p>
                )}
            </div>
            <div className={classes["navbar-option"]}>
                {pdfBase64 ? (
                    <a href={pdfBase64} download>
                        Ver Instructivo
                    </a>
                ) : (
                    <p> Ver Instructivo</p>
                )}
            </div>
            <div className={classes["navbar-option"]}>
                {" "}
                <Link to="/user" onClick={() => closeNavbar()}>
                    Mis Datos{" "}
                </Link>
            </div>
            <div className={classes["navbar-option"]}>
                <Link onClick={handleLogout}>Salir </Link>
            </div>

            <LogOut
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
};
