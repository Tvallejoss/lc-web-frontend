import React, { useState } from "react";

// Components
import { NavbarOpenMobile } from "./navbarOpen/NavbarOpenMobile";

// Icons
import { IconMenu } from "../../../assets/icons";

// Styles
import classes from "./NavbarMobile.module.css";

export const NavbarMobile = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);

    const handleOpen = () => {
        setNavbarOpen(true);
        document.documentElement.style.overflow = "hidden";
        document.body.scroll = "no";
    };

    const handleClose = () => {
        setNavbarOpen(false);
        document.documentElement.style.overflow = "auto";
        document.body.scroll = "yes";
    };

    return (
        <div
            className={
                navbarOpen
                    ? `${classes["navbar-container-open"]}`
                    : classes["navbar-container"]
            }
        >
            <div className={classes["navbar-logo"]}>
                <img
                    src={require("../../../assets/images/logoLC.png")}
                    alt="LOGO"
                />
            </div>

            <section className={classes["navbar-menu-icon"]}>
                <IconMenu onClick={navbarOpen ? handleClose : handleOpen} />
            </section>

            {/* Navbar expandida */}
            {navbarOpen && (
                <div className={classes["navbar-expanded"]}>
                    <NavbarOpenMobile closeNavbar={handleClose} />
                </div>
            )}
        </div>
    );
};
