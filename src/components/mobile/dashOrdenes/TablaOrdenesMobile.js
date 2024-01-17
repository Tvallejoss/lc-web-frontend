// Hooks
import React from "react";
import { useNavigate } from "react-router-dom";

//Components
import { CardOrden } from "./cardOrden/CardOrden";

// Styles
import classes from "./TablaOrdenesMobile.module.css";

export const TablaOrdenesMobile = ({ ordenes }) => {
    const navigate = useNavigate();

    return (
        <div className={classes["tableMobile-container"]}>
            <div className={classes["search-tableMobile"]}>
                <input
                    placeholder="#1111"
                    className={classes["search-input"]}
                />
                <button className={classes["search-btn"]}>Buscar</button>
            </div>

            <div className={classes["cards-container"]}>
                {ordenes.length ? (
                    ordenes.map((orden, i) => {
                        return <CardOrden key={i} orden={orden} />;
                    })
                ) : (
                    <>No hay Ordenes</>
                )}
                <div className="boton-pdf-volver">
                    <button onClick={() => navigate(-1)}>VOLVER</button>
                </div>
            </div>
        </div>
    );
};
