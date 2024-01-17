import React, { useState, useEffect } from "react";
import axios from "axios";

const DatosArgentina = () => {
    const [provincias, setProvincias] = useState([]);
    const [selectedProvincia, setSelectedProvincia] = useState("");
    const [localidades, setLocalidades] = useState([]);
    const [selectedLocalidad, setSelectedLocalidad] = useState("");
    const [filterProvinciaText, setFilterProvinciaText] = useState("");
    const [filterLocalidadText, setFilterLocalidadText] = useState("");

    useEffect(() => {
        axios
            .get("https://apis.datos.gob.ar/georef/api/provincias")
            .then((response) => {
                setProvincias(response.data.provincias);
            })
            .catch((error) => {
                console.error("Error al obtener las provincias:", error);
            });
    }, []);

    useEffect(() => {
        if (selectedProvincia) {
            axios
                .get(
                    `https://apis.datos.gob.ar/georef/api/localidades?provincia=${selectedProvincia}&max=5000`
                )
                .then((response) => {
                    setLocalidades(response.data.localidades);
                })
                .catch((error) => {
                    console.error("Error al obtener las localidades:", error);
                });
        }
    }, [selectedProvincia]);

    // Filtrar las provincias según el texto ingresado
    const filteredProvincias = provincias.filter((provincia) =>
        provincia.nombre
            .toLowerCase()
            .includes(filterProvinciaText.toLowerCase())
    );

    // Filtrar las localidades según el texto ingresado
    const filteredLocalidades = localidades.filter((localidad) =>
        localidad.nombre
            .toLowerCase()
            .includes(filterLocalidadText.toLowerCase())
    );

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Buscar provincia"
                    value={filterProvinciaText}
                    onChange={(e) => setFilterProvinciaText(e.target.value)}
                />
                <select
                    value={selectedProvincia}
                    onChange={(e) => setSelectedProvincia(e.target.value)}
                >
                    <option value="">Seleccione una provincia</option>
                    {filteredProvincias.map((provincia) => (
                        <option key={provincia.id} value={provincia.nombre}>
                            {provincia.nombre}
                        </option>
                    ))}
                </select>
            </div>
            {selectedProvincia && (
                <div>
                    <input
                        type="text"
                        placeholder="Buscar Localidad"
                        value={filterLocalidadText}
                        onChange={(e) => setFilterLocalidadText(e.target.value)}
                    />
                    <select
                        value={selectedLocalidad}
                        onChange={(e) => setSelectedLocalidad(e.target.value)}
                    >
                        <option value="">Seleccione una localidad</option>
                        {filteredLocalidades.map((localidad) => (
                            <option key={localidad.id} value={localidad.nombre}>
                                {localidad.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default DatosArgentina;
