//Hooks
import React, { useState, useEffect } from "react";

// Styles
import classes from "./SearchInput.module.css";

/* props: necesita los campos para poder filtrarlos */
export const SearchInput = ({ setCampos, allCampos, selectOptions }) => {
    // Filtro input search State
    const [search, setSearch] = useState("");
    const [filtro, setFiltro] = useState(selectOptions[0]); //primer valor ID

    useEffect(() => {
        if (search) {
            const filteredDerivacion = allCampos.filter((derivacion) => {
                return derivacion[filtro]
                    .toLowerCase()
                    .includes(search.toLowerCase());
            });
            setCampos(filteredDerivacion);
            return;
        } else {
            setCampos(allCampos);
        }
    }, [search]);

    return (
        <div className={classes["INPUT"]}>
            <div className={classes["search-by"]}>
                <span>Buscar por:</span>
                <select
                    className={classes["select-filtro"]}
                    name="filtro"
                    onChange={(e) => setFiltro(e.target.value)}
                >
                    {selectOptions?.map((optionValue, i) => {
                        return (
                            <option key={i} value={optionValue}>
                                {optionValue}
                            </option>
                        );
                    })}
                </select>
            </div>
            <input
                placeholder="Buscar"
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
};

/* props: necesita los campos para poder filtrarlos */
export const SearchInputMobile = ({ setCampos, allCampos, selectOptions }) => {
    // Filtro input search State
    const [search, setSearch] = useState("");
    const [filtro, setFiltro] = useState(selectOptions[0]); //primer valor ID

    const clickButtonSearch = () => {
        if (search) {
            const filteredDerivacion = allCampos.filter((derivacion) => {
                return derivacion[filtro]
                    .toLowerCase()
                    .includes(search.toLowerCase());
            });
            setCampos(filteredDerivacion);
            return;
        } else {
            setCampos(allCampos);
        }
    };

    return (
        <div className={classes["search-tableMobile"]}>
            <input
                placeholder={filtro === "cuit" ? "Buscar por Cuit" : "Buscar por ID"}
                className={classes["search-input"]}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button
                className={classes["search-btn"]}
                onClick={clickButtonSearch}
            >
                Buscar
            </button>
        </div>
    );
};
