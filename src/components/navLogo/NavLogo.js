import React from "react";

// Styles
import classes from "./NavLogo.module.css";

export const NavLogo = ({ palabra }) => {
    return (
        <>
            <div className={classes["navLogo-container"]}>
                <div className={classes["logo-nav"]}>
                    <img
                        src={require("../../assets/images/logoLC.png")}
                        alt="LOGO-LC"
                    />
                </div>

                <div className={classes["palabra"]}>
                    <h1>{palabra}</h1>
                </div>
            </div>
        </>
    );
};
