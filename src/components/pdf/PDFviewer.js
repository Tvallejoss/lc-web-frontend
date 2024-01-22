// Hooks
import axios from "axios";
import config from "../../config/";
import { decryptObj } from "../../utils/secure-data/decrypt";
import { encrypt } from "../../utils/secure-data/crypt";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

// Styles
import classes from "./PDFviewer.module.css";

// Components
import { Sidebar } from "../sidebar/Sidebar";
import { NavLogo } from "../navLogo/NavLogo";
import { NavbarMobile } from "../mobile/navbar/NavbarMobile";

export const PDFviewer = () => {
    const navigate = useNavigate();
    const [pdfContent, setPdfContent] = useState(null);
    const { idOrden } = useParams();

    const [nobilisOrdenInfo, setNobilisOrdenInfo] = useState(null);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));

        if (token) {
            const getEstadoByOrden = async () => {
                try {
                    const { data } = await axios.post(
                        config.IP + config.PUERTO + "/resultadoByOrden",
                        {
                            token: token,
                            idOrden: await encrypt(config.KEY, idOrden),
                        }
                    );

                    const resultadoDecrypt = await decryptObj(data);
                    setNobilisOrdenInfo(resultadoDecrypt);

                    const pdfSrc = `data:application/pdf;base64,${resultadoDecrypt.pdfProtocol}`;
                    setPdfContent(pdfSrc);
                } catch (error) {
                    console.log(
                        "Error Axios al traer el estado de la orden en Mobile",
                        error
                    );
                    return error;
                }
            };
            getEstadoByOrden();
        }
    }, []);

    return (
        <div className={classes["BOX_PDF"]}>
            {/* {window.innerWidth <= 1000 && <NavbarMobile />} */}
            {window.innerWidth <= 1000 ? (
                <NavLogo palabra={"Resultado"} />
            ) : (
                <NavLogo />
            )}

            <div className={classes["pdf-container"]}>
                <div className={classes["SIDEBAR_PDF"]}>
                    <Sidebar />
                </div>
                <div className={classes["PDF"]}>
                    {nobilisOrdenInfo?.pdfProtocol ? (
                        <object
                            data={pdfContent}
                            type="application/pdf"
                            width="400"
                            height="750"
                            className={classes["PDF_SELECT"]}
                        >
                            <p>
                                Tu navegador no puede mostrar este archivo PDF.
                                Puedes descargarlo-----
                                <a
                                    href={pdfContent}
                                    download={"numero de orden" + "#" + idOrden}
                                >
                                    aquí
                                </a>
                                .
                            </p>
                        </object>
                    ) : (
                        "ERROR DE NOBILIS, PEDIR SOPORTE"
                    )}
                    <div className={classes["boton-pdf-volver"]}>
                        <button onClick={() => navigate(-1)}>VOLVER</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
