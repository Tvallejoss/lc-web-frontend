// Hooks
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleInputInfo } from "../../utils/handleInfo";
import { OnSubmitGeneric } from "../../utils/onSubmitFunctions/OnSubmitGeneric";
import useMediaQuery from "../../utils/mediaQuery/useMediaQuery";
import { encrypt } from "../../utils/secure-data/crypt";

// Config
import client from "../../config/index";

// Components
import { Sidebar } from "../sidebar/Sidebar";
import { NavLogo } from "../navLogo/NavLogo";
import { NavbarMobile } from "../mobile/navbar/NavbarMobile";

// Styles
import classes from "./Derivaciones.module.css";

export const Derivaciones = () => {
    const navigate = useNavigate();

    //Local States
    const [derivacionIndividual, setDerivacionIndividual] = useState({});
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
                        <input
                            type="text"
                            name="apellido"
                            placeholder="Apellido :"
                            onChange={(e) =>
                                handleInputInfo(
                                    setDerivacionIndividual,
                                    derivacionIndividual,
                                    e
                                )
                            }
                        />
                        <input
                            type="text"
                            placeholder="Nombre :"
                            name="nombre"
                            onChange={(e) =>
                                handleInputInfo(
                                    setDerivacionIndividual,
                                    derivacionIndividual,
                                    e
                                )
                            }
                        />

                        <select
                            name="genero"
                            defaultValue={"M"}
                            onChange={(e) => {
                                handleInputInfo(
                                    setDerivacionIndividual,
                                    derivacionIndividual,
                                    e
                                );
                            }}
                        >
                            <option value="M">MASCULINO</option>
                            <option value="F">FEMENINO</option>
                        </select>

                        <input
                            type="text"
                            placeholder="DNI :"
                            name="dni"
                            onChange={(e) =>
                                handleInputInfo(
                                    setDerivacionIndividual,
                                    derivacionIndividual,
                                    e
                                )
                            }
                        />

                        <input
                            type="estudios"
                            placeholder="Estudios :"
                            name="estudios"
                            onChange={(e) =>
                                handleInputInfo(
                                    setDerivacionIndividual,
                                    derivacionIndividual,
                                    e
                                )
                            }
                        />
                        <input
                            type="date"
                            placeholder="fecha de Nacimiento :"
                            name="fechaNacimiento"
                            onChange={(e) =>
                                handleInputInfo(
                                    setDerivacionIndividual,
                                    derivacionIndividual,
                                    e
                                )
                            }
                        />

                        <input
                            type="email"
                            placeholder="email :"
                            name="email"
                            onChange={(e) =>
                                handleInputInfo(
                                    setDerivacionIndividual,
                                    derivacionIndividual,
                                    e
                                )
                            }
                        />

                        <select
                            name="urgente"
                            defaultValue={"NO"}
                            onChange={(e) => {
                                handleInputInfo(
                                    setDerivacionIndividual,
                                    derivacionIndividual,
                                    e
                                );
                            }}
                        >
                            <option value="SI">URGENTE</option>
                            <option value="NO">NO URGENTE</option>
                        </select>

                        <textarea
                            placeholder="observaciones:"
                            name="observaciones"
                            onChange={(e) =>
                                handleInputInfo(
                                    setDerivacionIndividual,
                                    derivacionIndividual,
                                    e
                                )
                            }
                        ></textarea>
                    </div>

                    <div className={classes["BOTONES_FORM"]}>
                        <button
                            onClick={() => {
                                OnSubmitGeneric(
                                    derivacionIndividual,
                                    "/orden",
                                    setDerivacionIndividual,
                                    "derivacion_individual",
                                    navigate
                                );
                            }}
                        >
                            DERIVAR
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
        </div>
    );
};
