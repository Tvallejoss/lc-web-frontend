import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { handleInputInfo } from "../../utils/handleInfo";
import { OnSubmitGeneric } from "../../utils/onSubmitFunctions/OnSubmitGeneric";
import useMediaQuery from "../../utils/mediaQuery/useMediaQuery";
import { encrypt } from "../../utils/secure-data/crypt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToken } from "../../utils/auth/addToken";

// Config
import client from "../../config/index";

// Components
import { Sidebar } from "../sidebar/Sidebar";
import { NavLogo } from "../navLogo/NavLogo";
import { NavbarMobile } from "../mobile/navbar/NavbarMobile";

// Styles
import classes from "./Derivaciones.module.css";

// Utility function to show toast messages
export const showToastMessage = (type, msg) => {
    toast[type](msg, {
        position: "top-right",
    });
};

export const Derivaciones = () => {
    const navigate = useNavigate();

    // Local States
    const [derivacionIndividual, setDerivacionIndividual] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 1000px)");

    useEffect(() => {
        // Seteando el valor por default del genero (Masculino) y si es urgente (NO)
        const valuesByDefault = async () => {
            setDerivacionIndividual({
                ...derivacionIndividual,
                genero: await encrypt(client.KEY, "M"),
                urgente: await encrypt(client.KEY, "NO"),
            });
        };
        valuesByDefault();
    }, []);

    const validateForm = () => {
        const {
            apellido,
            nombre,
            genero,
            dni,
            estudios,
            fechaNacimiento,
            email,
            urgente,
        } = derivacionIndividual;
        const isValid =
            apellido && nombre && dni && estudios && fechaNacimiento && email;
        setIsFormValid(isValid);
    };

    const handleInputChange = (e) => {
        handleInputInfo(setDerivacionIndividual, derivacionIndividual, e);
        validateForm();
    };

    const handleSubmit = async () => {
        setLoading(true);
        setShowSpinner(true);

        try {
            let newInfo = derivacionIndividual;
            await axios.post(
                client.IP + client.PUERTO + "/orden",
                addToken(newInfo)
            );
            setDerivacionIndividual(data);
            navigate("/dashboard");
            showToastMessage("success", "Derivación cargada correctamente");
        } catch (error) {
            showToastMessage(
                "error",
                "Error, por favor inténtelo de nuevo más tarde"
            );
        } finally {
            setLoading(false);
            setShowSpinner(false);
        }
    };
    return (
        <div className={classes["DERIVACIONES_CONTAINER"]}>
            {!isDesktop ? <NavbarMobile /> : ""}

            <NavLogo palabra={"Derivaciones"} />

            <div className={classes["derivacion-sidebar-container"]}>
                <div className={classes["Sidebar_derivaciones"]}>
                    <Sidebar />
                </div>

                <div className={classes["FORM_DERIVACIONES"]}>
                    <div className={classes["BOX_FORM"]}>
                        <div className={classes["input-group"]}>
                            <label> Apellido: </label>
                            <input
                                type="text"
                                name="apellido"
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                        </div>

                        <div className={classes["input-group"]}>
                            <label> Nombre: </label>
                            <input
                                type="text"
                                name="nombre"
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                        </div>

                        <div className={classes["input-group"]}>
                            <label> Genero: </label>
                            <select
                                name="genero"
                                defaultValue={"M"}
                                onChange={handleInputChange}
                                autoComplete="off"
                            >
                                <option value="M">MASCULINO</option>
                                <option value="F">FEMENINO</option>
                            </select>
                        </div>

                        <div className={classes["input-group"]}>
                            <label> DNI: </label>
                            <input
                                type="text"
                                name="dni"
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                        </div>

                        <div className={classes["input-group"]}>
                            <label> Estudios: </label>
                            <input
                                type="text"
                                name="estudios"
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                        </div>

                        <div className={classes["input-group"]}>
                            <label> Fecha de nacimiento: </label>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                        </div>

                        <div className={classes["input-group"]}>
                            <label> Email: </label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                        </div>

                        <div className={classes["input-group"]}>
                            <label> Urgencia: </label>
                            <select
                                name="urgente"
                                defaultValue={"NO"}
                                onChange={handleInputChange}
                                autoComplete="off"
                            >
                                <option value="SI">URGENTE</option>
                                <option value="NO">NO URGENTE</option>
                            </select>
                        </div>

                        <div className={classes["input-group"]}>
                            <label> Observaciones </label>
                            <textarea
                                name="observaciones"
                                onChange={handleInputChange}
                                autoComplete="off"
                            ></textarea>
                        </div>
                    </div>

                    <div className={classes["BOTONES_FORM"]}>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !isFormValid}
                        >
                            {loading ? "CARGANDO..." : "DERIVAR"}
                        </button>

                        <Link
                            to="/dashboard"
                            className={classes["LINK_BUTTON"]}
                        >
                            <button>VOLVER</button>
                        </Link>
                    </div>
                </div>
            </div>

            {loading && showSpinner && (
                <div className={classes.modal}>
                    <div className={classes.spinner}></div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};
