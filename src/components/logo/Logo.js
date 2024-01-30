import React from "react";
import classes from "./Logo.module.css";

export const Logo = () => {
    return (
        <div className={classes["BOX_LOGO"]}>
            <img src={require("../../assets/images/logoLC.png")} alt="LOGO" />
        </div>
    );
};
