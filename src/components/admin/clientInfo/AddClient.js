// Components
import { Logo } from "../../logo/Logo";
import { NavLogo } from "../../navLogo/NavLogo";

// Hooks
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { OnSubmitRegisterUser } from "../../../utils/onSubmitFunctions/OnSubmitRegisterUser";
import { handleInputInfo } from "../../../utils/handleInfo";
import { isAdmin } from "../../../utils/auth/isAdmin";
import { setClientData } from "../../../state/clientSlice";
import { ToastContainer } from "react-toastify";
import useMediaQuery from "../../../utils/mediaQuery/useMediaQuery";
// Styles
import classes from "./AddClient.module.css";

export const AddClient = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Mobile
    const isDesktop = useMediaQuery("(min-width: 1000px)");

    //local_state
    const [LocalClient, setClientLocal] = useState({});

    useEffect(() => {
        if (!isAdmin()) {
            navigate("/");
            return;
        }
    });

    // Verificar Clave

    const [firstPassword, setFirstPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");
    const [error, setError] = useState("");

    const handlePassword = (e) => {
        setFirstPassword(e.target.value);
    };

    const checkPassword = (e) => {
        setSecondPassword(e.target.value);
        if (e.target.value === firstPassword) {
            handleInputInfo(setClientLocal, LocalClient, e)
            setError("");
        } else {
            setError("Las claves no coinciden");
        }
    };

    const handleSubmit = async () => {
        if (firstPassword === secondPassword) {
                OnSubmitRegisterUser(
                    LocalClient,
                    "/register",
                    dispatch,
                    navigate,
                    setClientData,
                    "Current_Client"
                );
            
        } else {
            setError("Las contraseñas no coinciden");
        }
    };

    return (
        <div className={classes["BOX_CLIENT"]}>
            <ToastContainer />
            <div className={classes["add-client-container"]}>
                {!isDesktop ? (
                    <NavLogo palabra={"Admin"} />
                ) : (
                    <div className={classes["logo-add-client"]}>
                        <Logo />
                    </div>
                )}

                <div className={classes["CLIENT_DATA"]}>
                    <h1>Datos Cliente</h1>

                    <ul>
                        <li>
                            <span>Razon Social:</span>{" "}
                            <input
                                name="razonSocial"
                                onChange={(e) =>
                                    handleInputInfo(
                                        setClientLocal,
                                        LocalClient,
                                        e
                                    )
                                }
                            />
                        </li>
                        <li>
                            <span>CUIT:</span>{" "}
                            <input
                                name="cuit"
                                type="number"
                                onChange={(e) =>
                                    handleInputInfo(
                                        setClientLocal,
                                        LocalClient,
                                        e
                                    )
                                }
                            />
                        </li>
                        <li>
                            <span>Domicilio:</span>{" "}
                            <input
                                name="domicilio"
                                onChange={(e) =>
                                    handleInputInfo(
                                        setClientLocal,
                                        LocalClient,
                                        e
                                    )
                                }
                            />
                        </li>
                        <li>
                            <span>Localidad:</span>{" "}
                            <input
                                name="localidad"
                                onChange={(e) =>
                                    handleInputInfo(
                                        setClientLocal,
                                        LocalClient,
                                        e
                                    )
                                }
                            />
                        </li>
                        <li>
                            <span>Provincia:</span>{" "}
                            <input
                                name="provincia"
                                onChange={(e) =>
                                    handleInputInfo(
                                        setClientLocal,
                                        LocalClient,
                                        e
                                    )
                                }
                            />
                            {/* <DatosArgentina/> */}
                        </li>
                        <li>
                            <span>Codigo Postal:</span>{" "}
                            <input
                                name="CP"
                                onChange={(e) =>
                                    handleInputInfo(
                                        setClientLocal,
                                        LocalClient,
                                        e
                                    )
                                }
                            />
                        </li>
                        <li>
                            <span>Telefono:</span>{" "}
                            <input
                                name="telefono"
                                type="number"
                                onChange={(e) =>
                                    handleInputInfo(
                                        setClientLocal,
                                        LocalClient,
                                        e
                                    )
                                }
                            />
                        </li>
                        <li>
                            <span>Mail:</span>{" "}
                            <input
                                name="mail"
                                type="email"
                                onChange={(e) =>
                                    handleInputInfo(
                                        setClientLocal,
                                        LocalClient,
                                        e
                                    )
                                }
                            />
                        </li>
                        <li>
                            <span>Usuario:</span>{" "}
                            <input
                                name="username"
                                onChange={(e) =>
                                    handleInputInfo(
                                        setClientLocal,
                                        LocalClient,
                                        e
                                    )
                                }
                            />
                        </li>
                        <li>
                            <span>clave de acceso:</span>{" "}
                            <input
                                type="password"
                                name="password"
                                onChange={handlePassword}
                            />
                        </li>

                        <li>
                            <span>Repetir clave de acceso:</span>{" "}
                            <input
                                type="password"
                                name="password"
                                onChange={checkPassword}
                            />
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <br />
                        </li>

                        <li>
                            <span>Estado del Cliente</span>
                            <select
                                // value={selectedOption}
                                name="estado"
                                onChange={(e) =>
                                    handleInputInfo(
                                        setClientLocal,
                                        LocalClient,
                                        e
                                    )
                                }
                            >
                                <option value="">--Selecciona--</option>
                                <option value="0">INACTIVO</option>
                                <option value="1">ACTIVO</option>
                            </select>
                        </li>
                    </ul>

                    <div className={classes["CLIENT_BUTTONS"]}>
                        <button
                            className={classes["Mod"]}
                            onClick={handleSubmit}
                        >
                            Aceptar Alta
                        </button>
                        <Link to="/ADMIN">
                            <button className={classes["Exit"]}>Salir</button>{" "}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
