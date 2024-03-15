import React from "react";
import { Link, useParams } from "react-router-dom";

import useMediaQuery from "../../utils/mediaQuery/useMediaQuery";

// Styles
import classes from "./Dashboard.module.css";

// Icons
import { IconUser, IconUsers } from "../../assets/icons/";

// Components
import { Tabla } from "../dashboard/tabla/Tabla";
import { TablaOrdenes } from "../ordenes/tabla/TablaOrdenes";
import { NavLogo } from "../navLogo/NavLogo";
import { Sidebar } from "../sidebar/Sidebar";
import { NavbarMobile } from "../mobile/navbar/NavbarMobile";

export const Dashboard = () => {
    const params = useParams();
    const isDesktop = useMediaQuery("(min-width: 1000px)");

    return (
        <div className={classes["dashboard-container"]}>
            {!isDesktop ? <NavbarMobile /> : ""}

            {Object.entries(params).length === 0 ? (
                <NavLogo palabra={"Derivaciones"} />
            ) : (
                <NavLogo palabra={"Ordenes"} />
            )}
            <div className={classes["table-container"]}>
                <div className={classes["sidebar-dashboard-container"]}>
                    <Sidebar />

                    <div className={classes["BOTONES_SIDEBAR"]}>
                        <Link
                            to="/derivaciones"
                            className={classes["individual"]}
                        >
                            <IconUser />
                            <p>Derivar paciente</p>
                        </Link>
                        <Link to="/excel" className={classes["lote"]}>
                            <IconUsers />
                            <p>Derivar en lote</p>
                        </Link>
                    </div>
                </div>
                {Object.entries(params).length === 0 ? (
                    <Tabla />
                ) : (
                    <TablaOrdenes id={params.id} />
                )}
            </div>
        </div>
    );
};
