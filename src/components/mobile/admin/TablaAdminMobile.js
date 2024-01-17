// Hooks
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../../../utils/auth/logOut";

// Components
import { LogOut } from "../../logOut/LogOut";
import { NavLogo } from "../../navLogo/NavLogo";
import { OptionsPopover } from "./popUpAdminFiles/OptionsPopover";

// Styles
import classes from "./TablaAdminMobile.module.css";

export const TablaAdminMobile = ({ data }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Modal Functions/states
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

    // PopUp Functions/states
    const [isOpen, setOpen] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);

    const openPopover = () => {
        setOpen(true);
    };

    const closePopover = () => {
        setOpen(false);
    };

    return (
        <div className={classes["tableMobile-container"]}>
            <NavLogo palabra={"Admin"} />

            <div className={classes["search-tableMobile"]}>
                <input
                    placeholder="#1111"
                    className={classes["search-input"]}
                />
                <button className={classes["search-btn"]}>Buscar</button>
            </div>

            <div className={classes["popUp-container"]}>
                <div
                    ref={setReferenceElement}
                    onClick={openPopover}
                    className={classes["popUp-text"]}
                >
                    Subir Archivos
                </div>
                <OptionsPopover
                    isOpen={isOpen}
                    onClose={closePopover}
                    referenceElement={referenceElement}
                />
            </div>
            <div className={classes["cards-container"]}>
                {data.length ? (
                    data.map((origen, i) => {
                        return (
                            <Link
                                to={"/cliente/" + origen.cuit}
                                key={i}
                                className={classes["card"]}
                            >
                                <div>
                                    <div className={classes["card-info-top"]}>
                                        <p>#{origen.id ? origen.id : "||"}</p>

                                        <p>Cuit: {origen.cuit}</p>
                                    </div>
                                    <div>
                                        <h6>{origen.usernameDeUsuario}</h6>

                                        <p>{origen.mail}</p>
                                    </div>

                                    <div
                                        className={classes["card-info-bottom"]}
                                    >
                                        <p>
                                            Razon Social:{" "}
                                            <span>{origen.razonSocial}</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <>No hay origenes</>
                )}
            </div>

            <div className={classes["button-new-origen"]}>
                <div className={classes["tableMobile-cerrar-session"]}>
                    <p onClick={handleLogout}> Cerrar session</p>
                </div>
                <Link to="/ADMIN/client">
                    <button>+ Alta nuevo cliente</button>
                </Link>
            </div>

            <LogOut
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
};
