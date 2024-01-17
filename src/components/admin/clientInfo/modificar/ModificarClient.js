// Hooks
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { OnSubmitUpdateUser } from "../../../../utils/onSubmitFunctions/OnSubmitUpdateUser";
import { handleInputInfo } from "../../../../utils/handleInfo";
import { encrypt } from "../../../../utils/secure-data/crypt";
import { decryptObj } from "../../../../utils/secure-data/decrypt";
import { isAdmin } from "../../../../utils/auth/isAdmin";
import useMediaQuery from "../../../../utils/mediaQuery/useMediaQuery";

// Config
import config from "../../../../config";

// Styles
import classes from "./ModificarClient.module.css";

// Components
import { Logo } from "../../../logo/Logo";
import { NavLogo } from "../../../navLogo/NavLogo";

export const ModificarClient = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Mobile
    const isDesktop = useMediaQuery("(min-width: 1000px)");

    // local_state
    const [LocalClient, setClientLocal] = useState({});
    const [LocalClientEncrypted, setClientLocalEncrypted] = useState({});
    const [newDataClient, setNewData] = useState({});
    const [isEditing, setIsEditing] = useState(false); // Nuevo estado para controlar la edición

    const { cuit } = useParams();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));

        if (!isAdmin()) {
            navigate("/");
            return;
        }

        const getOrigen = async () => {
            axios
                .post(config.IP + config.PUERTO + "/origenIndividual", {
                    token: token,
                    cuit: await encrypt(config.KEY, cuit),
                })
                .then(async ({ data }) => {
                    setClientLocalEncrypted(data);
                    setClientLocal(await decryptObj(data));
                })
                .catch((error) => {
                    console.log("Error al traer el origen por cuit", error);
                });
        };

        getOrigen();
    }, []);

    return (
        <div className={classes["BOX_MODCLIENT"]}>
            {!isDesktop ? (
                <NavLogo palabra={"Admin"} />
            ) : (
                <div className={classes["logo-mod-client"]}>
                    <Logo />
                </div>
            )}

            <div className={classes["MODCLIENT_DATA"]}>
                <h1>Datos Cliente</h1>

                <ul>
                    <li>
                        <span>Razon Social:</span>
                        <input
                            name="razonSocial"
                            defaultValue={LocalClient.razonSocial}
                            onChange={(e) =>
                                isEditing &&
                                handleInputInfo(setNewData, newDataClient, e)
                            }
                            disabled={!isEditing}
                        />
                    </li>
                    <li>
                        <span>CUIT:</span>{" "}
                        <input
                            defaultValue={LocalClient.cuit}
                            name="cuit"
                            onChange={(e) =>
                                isEditing &&
                                handleInputInfo(setNewData, newDataClient, e)
                            }
                            disabled={!isEditing}
                        />
                    </li>
                    <li>
                        <span>Domicilio:</span>{" "}
                        <input
                            name="domicilio"
                            defaultValue={LocalClient.domicilio}
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
                            defaultValue={LocalClient.localidad}
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
                            defaultValue={LocalClient.provincia}
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
                            defaultValue={LocalClient.CP}
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
                            defaultValue={LocalClient.telefono}
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
                            defaultValue={LocalClient.mail}
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
                            defaultValue={LocalClient.username}
                            onChange={(e) =>
                                isEditing &&
                                handleInputInfo(setNewData, newDataClient, e)
                            }
                            disabled={!isEditing}
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
                                    "/origenUpdate",
                                    dispatch,
                                    navigate,
                                    setClientLocalEncrypted,
                                    "Current_Client"
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

                    <Link to="/ADMIN">
                        <button className={classes["Exit"]}>Salir</button>{" "}
                    </Link>
                </div>
            </div>
        </div>
    );
};
