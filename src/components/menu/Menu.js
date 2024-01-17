// Hooks
import React, { useEffect } from "react";
import useMediaQuery from "../../utils/mediaQuery/useMediaQuery";
import { useNavigate } from "react-router-dom";

// Components
import { Logo } from "../logo/Logo";
import { Sidebar } from "../sidebar/Sidebar";

// Styles
import classes from "./Menu.module.css";

export const Menu = () => {
    const navigate = useNavigate();

    // eslint-disable-next-line
    const isDesktop = useMediaQuery("(min-width: 1000px)");

    useEffect(() => {
        if (window.innerWidth <= 1000) {
            navigate("/dashboard");
        } else {
            return;
        }
    }, [window.innerWidth]);
    return (
        <div className={classes["BOX_MENU"]}>
            <div className={classes["LOGO"]}>
                <Logo />
            </div>

            <div className={classes["Sidebar_Menu_Container"]}>
                <Sidebar />
            </div>
        </div>
    );
};
