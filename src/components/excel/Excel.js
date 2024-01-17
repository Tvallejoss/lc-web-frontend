// Components
import { Sidebar } from "../sidebar/Sidebar";
import { NavbarMobile } from "../mobile/navbar/NavbarMobile";
import { NavLogo } from "../navLogo/NavLogo";

// Styles
import classes from "./Excel.module.css";
// Hooks
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMediaQuery from "../../utils/mediaQuery/useMediaQuery";

// Config
const config = require("../../config");

export const Excel = () => {
    const isDesktop = useMediaQuery("(min-width: 1000px)");
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [fileSelected, setFileSelected] = useState(false);
    const isUserLog = JSON.parse(localStorage.getItem("UserLoggedInfo"));

    function obtenerNombreSinExtension(nombreArchivo) {
        return nombreArchivo.replace(/\.[^.]*$/, "");
    }

    const handleFileDrop = (event) => {
        event.preventDefault();

        const droppedFile = event.dataTransfer.files[0];

        setFile(droppedFile);
        setFileSelected(true);
    };

    const handleFileChange = (event) => {
        event.preventDefault();

        const selectedFile = event.target.files[0];

        setFile(selectedFile);
        setFileSelected(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = async (event) => {
                try {
                    const arrayBuffer = event.target.result;
                    const byteArray = new Uint8Array(arrayBuffer);

                    // eslint-disable-next-line
                    const response = await axios.post(
                        config.IP + config.PUERTO + "/ordenes",
                        byteArray, // Enviar directamente el array de bytes
                        {
                            headers: {
                                "Content-Type": "application/octet-stream",
                                token: `${isUserLog}`, // Agregar el token de usuario
                                excelName: obtenerNombreSinExtension(file.name), //NOMBRE DEL EXCEL
                            },
                        }
                    );

                    navigate("/dashboard");
                } catch (error) {
                    console.error("Error al subir el archivo:", error);
                }
            };

            fileReader.readAsArrayBuffer(file);
        }
    };

    return (
        <div className={classes["EXCEL_CONTAINER"]}>
            {!isDesktop ? <NavbarMobile /> : ""}

            <NavLogo palabra={"Derivaciones"} />

            <div className={classes["Excel-sidebar-container"]}>
                <div className={classes["Sidebar_derivaciones"]}>
                    <Sidebar />
                </div>

                <div className={classes["BOX_EXCEL"]}>
                    {!fileSelected ? (
                        <div
                            className={[classes.UPLOAD, classes.DROP_AREA].join(
                                " "
                            )}
                            onDrop={(event) => handleFileDrop(event)}
                            onDragOver={(event) => event.preventDefault()}
                        >
                            <div className={classes["ICONOS_EXCEL"]}>
                                <img
                                    src="https://cdn.discordapp.com/attachments/1095387607409635330/1124372972413665300/icons8-xls-48.png"
                                    alt="EXCEL_ICON"
                                />
                                <img
                                    src="https://cdn.discordapp.com/attachments/1095387607409635330/1124375666893279273/icons8-indice-y-pulgar-50.png"
                                    alt="MANO"
                                />
                            </div>

                            <p>Arraste y suelte el archivo aqui...</p>

                            <p>...o busquelo en su ordenador</p>

                            <div className={classes["INPUT_FILE"]}>
                                {/* <button>Buscar Archivo</button> */}
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".xlsx"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={classes["UPLOAD"]}>
                            <div className={classes["ICONOS_EXCEL"]}>
                                <img
                                    src="https://cdn.discordapp.com/attachments/1095387607409635330/1124372972413665300/icons8-xls-48.png"
                                    alt="EXCEL_ICON"
                                />
                            </div>

                            <p>Excel seleccionado: {file.name}</p>

                            <div className={classes["INPUT_FILE"]}>
                                {/* <button>Buscar Archivo</button> */}
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".xlsx"
                                />
                            </div>
                        </div>
                    )}

                    <div className={classes["BOTONES_EXCEL"]}>
                        <button onClick={handleSubmit}>DERIVAR</button>

                        <Link
                            to="/dashboard"
                            className={classes["EXCEL_BUTTON"]}
                        >
                            <button>VOLVER</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
