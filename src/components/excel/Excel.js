// Components
import { Sidebar } from "../sidebar/Sidebar";
import { NavbarMobile } from "../mobile/navbar/NavbarMobile";
import { NavLogo } from "../navLogo/NavLogo";

// Styles
import classes from "./Excel.module.css";

// Icons
import { IconFile, IconUpload } from "../../assets/icons";

// Hooks
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMediaQuery from "../../utils/mediaQuery/useMediaQuery";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Config
const config = require("../../config");

// Utility function to show toast messages
export const showToastMessage = (type, msg) => {
    toast[type](msg, {
        position: "top-right",
    });
};

export const Excel = () => {
    const isDesktop = useMediaQuery("(min-width: 1000px)");
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [fileSelected, setFileSelected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
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
        setLoading(true);
        setShowSpinner(true);

        setTimeout(async () => {
            if (file) {
                const fileReader = new FileReader();
                fileReader.onload = async (event) => {
                    try {
                        const arrayBuffer = event.target.result;
                        const byteArray = new Uint8Array(arrayBuffer);

                        await axios.post(
                            config.IP + config.PUERTO + "/ordenes",
                            byteArray,
                            {
                                headers: {
                                    "Content-Type": "application/octet-stream",
                                    token: `${isUserLog}`,
                                    excelName: obtenerNombreSinExtension(
                                        file.name
                                    ),
                                },
                            }
                        );

                        showToastMessage(
                            "success",
                            "Archivo subido exitosamente."
                        );
                        navigate("/dashboard");
                    } catch (error) {
                        console.error("Error al subir el archivo:", error);

                        if (error.response.data.Error) {
                            showToastMessage(
                                "error",
                                error.response.data.Error
                            );
                        }

                        showToastMessage(
                            "error",
                            error.response.data.errors.errors.Error
                        );
                    } finally {
                        setLoading(false);
                        setShowSpinner(false);
                    }
                };

                fileReader.readAsArrayBuffer(file);
            }
        }, 2000); // Espera 2 segundos antes de hacer la solicitud
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
                                <IconUpload />
                            </div>

                            <p>Arraste y suelte el archivo aquí...</p>

                            <p>...o búsquelo en su ordenador</p>

                            <div className={classes["INPUT_FILE"]}>
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
                                <IconFile />
                            </div>

                            <p>Excel seleccionado: {file?.name}</p>

                            <div className={classes["INPUT_FILE"]}>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".xlsx"
                                />
                            </div>
                        </div>
                    )}

                    <div className={classes["BOTONES_EXCEL"]}>
                        <button
                            onClick={handleSubmit}
                            disabled={!fileSelected}
                            className={`${classes.BUTTON} ${
                                !fileSelected ? classes.disabledButton : ""
                            }`}
                        >
                            DERIVAR
                        </button>

                        <Link
                            to="/dashboard"
                            className={classes["EXCEL_BUTTON"]}
                        >
                            <button>VOLVER</button>
                        </Link>
                    </div>
                </div>
            </div>

            {loading && showSpinner && (
                <div className={classes.modal}>
                    <div className={classes.spinner}></div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};
