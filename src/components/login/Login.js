import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../../state/user";

import { handleInputInfo } from "../../utils/handleInfo";
import { OnSubmitUserLog } from "../../utils/onSubmitFunctions/OnSubmitUserLog";

// Components
import { Logo } from "../logo/Logo";
import { NavbarMobile } from "../mobile/navbar/NavbarMobile";

// Styles
import classes from "./Login.module.css";

//Notificaciones
import { showToastMessage } from "../notificacion/Notificacion";
import { ToastContainer } from "react-toastify";

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //local_state
    const [LocalUser, setUserLocal] = useState({});

    const ejecutarSubmit = () => {



        OnSubmitUserLog(
            LocalUser,
            "/login",
            dispatch,
            navigate,
            setUserData,
            "UserLoggedInfo",
        );
        return;
    };

    const submitEnter = (e) => {
        if (e.keyCode === 13) {
            ejecutarSubmit();
            // e.target.value = "";
        }
    };
    return (
        <div className={classes["BOX"]}>
            <div className={classes["navbarMobile-container"]}>
                <NavbarMobile />
            </div>

            <div className={classes["LOGO"]}>
                <Logo />
            </div>
            <ToastContainer />
            <div className={classes["FORM_LOGIN"]}>
                <input
                    type="text"
                    autoComplete="off"
                    placeholder="Usuario"
                    name="username"
                    onKeyUp={submitEnter}
                    onChange={(e) =>
                        handleInputInfo(setUserLocal, LocalUser, e)
                    }
                    onFocus={(e) => e.target.removeAttribute("readonly")}
                    onBlur={(e) =>
                        e.target.setAttribute("readonly", "readonly")
                    }
                    readOnly
                />
                <input
                    type="password"
                    autoComplete="off"
                    placeholder="Clave"
                    name="password"
                    onKeyUp={submitEnter}
                    onChange={(e) =>
                        handleInputInfo(setUserLocal, LocalUser, e)
                    }
                    onFocus={(e) => e.target.removeAttribute("readonly")}
                    onBlur={(e) =>
                        e.target.setAttribute("readonly", "readonly")
                    }
                    readOnly
                />
                <button
                    onClick={() => {
                        if (LocalUser.password && LocalUser.username) {
                            ejecutarSubmit();
                            return;
                        }
                        showToastMessage(
                            "warning",
                            "Por favor completa el usuario/clave"
                        );
                    }}
                >
                    INGRESAR
                </button>
                {/* <p>Olvidé mi clave</p> */}
            </div>
        </div>
    );
};
