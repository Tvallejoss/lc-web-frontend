// Hooks
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../../../utils/auth/logOut";

// Components
import { LogOut } from "../../logOut/LogOut";
import { NavLogo } from "../../navLogo/NavLogo";
import { OptionsPopover } from "./popUpAdminFiles/OptionsPopover";
import { SearchInputMobile } from "../../searchInput/SearchInput";
import { CardAdmin } from "./cardAdmin/CardAdmin";

// Styles
import classes from "./TablaAdminMobile.module.css";

export const TablaAdminMobile = ({ data }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Campos State
    const [campos, setCampos] = useState([]);
    useEffect(() => {
        setCampos(data);
    }, [data]);

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

            <SearchInputMobile
                setCampos={setCampos}
                allCampos={data}
                selectOptions={["cuit"]}
            />

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
                {campos.length ? (
                    campos.map((origen, i) => {
                        return <CardAdmin origen={origen} />;
                    })
                ) : (
                    <>No se encuentran origenes</>
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
