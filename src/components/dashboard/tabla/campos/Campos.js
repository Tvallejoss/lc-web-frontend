import React, { useState } from "react";
import { Link } from "react-router-dom";
import classes from "./Campos.module.css";

export const Campos = ({ derivacion }) => {
    const [ModalEstado, setModalEstado] = useState(false);

    const newModalValue = () => {
        setModalEstado(!ModalEstado);
    };

    return (
        <Link to={"/dashboard/" + derivacion.id}>
            <ol className={classes["VALORES"]} onClick={newModalValue}>
                <li>{derivacion.fechaEmision}</li>

                <li>
                    {derivacion.tipo !== "INDIVIDUAL" ? (
                        <p>En Lote</p>
                    ) : (
                        <p>Individual</p>
                    )}
                </li>
                {derivacion.tipo !== "INDIVIDUAL" ? (
                    <li>
                        {" "}
                        <span className={classes["VERDE"]}>Excel:</span>{" "}
                        {derivacion.nombre}
                    </li>
                ) : (
                    <li>{derivacion.nombre}</li>
                )}

                <li>{derivacion.id}</li>
            </ol>
        </Link>
    );
};
