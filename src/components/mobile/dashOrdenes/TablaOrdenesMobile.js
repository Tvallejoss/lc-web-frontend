// Hooks
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

//Components
import { CardOrden } from "./cardOrden/CardOrden";
import { SearchInputMobile } from "../../searchInput/SearchInput";

// Styles
import classes from "./TablaOrdenesMobile.module.css";

export const TablaOrdenesMobile = ({ ordenes }) => {
    const navigate = useNavigate();

    // Campos State
    const [campos, setCampos] = useState([]);
    useEffect(() => {
        setCampos(ordenes);
    }, [ordenes]);

    return (
        <div className={classes["tableMobile-container"]}>
            <SearchInputMobile
                setCampos={setCampos}
                allCampos={ordenes}
                selectOptions={["idOrden"]}
            />
            <div className={classes["cards-container"]}>
                {campos.length ? (
                    campos.map((orden, i) => {
                        return <CardOrden key={i} orden={orden} />;
                    })
                ) : (
                    <>No hay Ordenes</>
                )}
                <div className={classes["boton-volver"]}>
                    <button onClick={() => navigate(-1)}>VOLVER</button>
                </div>
            </div>
        </div>
    );
};
