import React, { useState } from "react";

// Components
import { NavbarOpenMobile } from "./navbarOpen/NavbarOpenMobile";

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
                    src="https://cdn.discordapp.com/attachments/1095387607409635330/1134039298946105344/image.png"
                    alt="LOGO"
                />
            </div>

            <section className={classes["navbar-menu-icon"]}>
                <img
                    width="50"
                    height="50"
                    src="https://img.icons8.com/ios-filled/50/menu--v1.png"
                    alt="menu--v1"
                    onClick={navbarOpen ? handleClose : handleOpen}
                />
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
