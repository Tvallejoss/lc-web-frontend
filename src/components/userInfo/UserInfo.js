// Hooks
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getDataFromAxios } from "../../utils/axiosFunctions/axiosGeneric";
import { OnSubmitUpdateUser } from "../../utils/onSubmitFunctions/OnSubmitUpdateUser";
import { handleInputInfo } from "../../utils/handleInfo";
import useMediaQuery from "../../utils/mediaQuery/useMediaQuery";

// Components
import { Logo } from "../logo/Logo";
import { NavbarMobile } from "../mobile/navbar/NavbarMobile";
// Styles
import classes from "./UserInfo.module.css";

export const UserInfo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [origenInfo, setOrigenInfo] = useState({});
    const [LocalClientEncrypted, setClientLocalEncrypted] = useState({});
    const [newDataClient, setNewData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 1000px)");

    useEffect(() => {
        getDataFromAxios("/myOrigen", setOrigenInfo, setClientLocalEncrypted);
    }, []);

    return (
        <div className={classes["BOX_USER"]}>
            <div className={classes["LOGO"]}>
                <Logo />
            </div>

            {!isDesktop ? <NavbarMobile /> : ""}
            <div className={classes["USER_DATA"]}>
                <h1>Mis Datos</h1>

                <ul>
                    <li>
                        <span>Razon Social:</span>
                        <input
                            name="razonSocial"
                            defaultValue={origenInfo.razonSocial}
                            disabled={true}
                        />
                    </li>
                    <li>
                        <span>CUIT:</span>{" "}
                        <input
                            defaultValue={origenInfo.cuit}
                            name="cuit"
                            disabled={true}
                        />
                    </li>
                    <li>
                        <span>Domicilio:</span>{" "}
                        <input
                            name="domicilio"
                            defaultValue={origenInfo.domicilio}
                            onChange={(e) =>
                                isEditing &&
                                handleInputInfo(setNewData, newDataClient, e)
                            }
                            disabled={!isEditing}
                        />
                    </li>
                    <li>
                        <span>Localidad:</span>{" "}
                        <input
                            name="localidad"
                            defaultValue={origenInfo.localidad}
                            onChange={(e) =>
                                isEditing &&
                                handleInputInfo(setNewData, newDataClient, e)
                            }
                            disabled={!isEditing}
                        />
                    </li>
                    <li>
                        <span>Provincia:</span>{" "}
                        <input
                            name="provincia"
                            defaultValue={origenInfo.provincia}
                            onChange={(e) =>
                                isEditing &&
                                handleInputInfo(setNewData, newDataClient, e)
                            }
                            disabled={!isEditing}
                        />
                    </li>
                    <li>
                        <span>Codigo Postal:</span>{" "}
                        <input
                            name="CP"
                            defaultValue={origenInfo.CP}
                            onChange={(e) =>
                                isEditing &&
                                handleInputInfo(setNewData, newDataClient, e)
                            }
                            disabled={!isEditing}
                        />
                    </li>
                    <li>
                        <span>Telefono:</span>{" "}
                        <input
                            name="telefono"
                            defaultValue={origenInfo.telefono}
                            onChange={(e) =>
                                isEditing &&
                                handleInputInfo(setNewData, newDataClient, e)
                            }
                            disabled={!isEditing}
                        />
                    </li>
                    <li>
                        <span>Mail:</span>{" "}
                        <input
                            name="mail"
                            defaultValue={origenInfo.mail}
                            onChange={(e) =>
                                isEditing &&
                                handleInputInfo(setNewData, newDataClient, e)
                            }
                            disabled={!isEditing}
                        />
                    </li>
                    <li>
                        <span>Usuario:</span>{" "}
                        <input
                            name="username"
                            defaultValue={origenInfo.username}
                            disabled={true}
                        />
                    </li>
                </ul>

                <div className={classes["CLIENT_BUTTONS"]}>
                    {isEditing ? (
                        <button
                            className={classes["Mod"]}
                            onClick={() => {
                                OnSubmitUpdateUser(
                                    LocalClientEncrypted,
                                    newDataClient,
                                    "/myOrigenUpdate",
                                    dispatch,
                                    navigate,
                                    setClientLocalEncrypted,
                                    "ORIGEN_UPDATE"
                                );
                                setIsEditing(false);
                            }}
                            disabled={!isEditing}
                        >
                            Guardar
                        </button>
                    ) : (
                        <button
                            className={classes["Mod"]}
                            onClick={() => {
                                setIsEditing(true);
                            }}
                            disabled={isEditing}
                        >
                            Modificar
                        </button>
                    )}

                    <Link to="/home">
                        <button className={classes["Exit"]}>Salir</button>{" "}
                    </Link>
                </div>
            </div>
        </div>
    );
};
