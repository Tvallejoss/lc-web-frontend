// Hooks
import axios from "axios";
import config from "../../config/";
import { decryptObj } from "../../utils/secure-data/decrypt";
import { encrypt } from "../../utils/secure-data/crypt";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

// Styles
import "./PDFviewer.css";

// Components
import { Sidebar } from "../sidebar/Sidebar";
import { NavLogo } from "../navLogo/NavLogo";
import { NavbarMobile } from "../mobile/navbar/NavbarMobile";

export const PDFviewer = () => {
    const navigate = useNavigate();
    const [pdfContent, setPdfContent] = useState(null);
    const { pdf } = useParams();

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
                            idOrden: await encrypt(config.KEY, pdf),
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
        <div className="BOX_PDF ">
            {window.innerWidth <= 1000 && <NavbarMobile />}
            {window.innerWidth <= 1000 ? (
                <NavLogo palabra={"Resultado"} />
            ) : (
                <NavLogo />
            )}

            <div className="pdf-container">
                <div className="SIDEBAR_PDF">
                    <Sidebar />
                </div>
                <div className="PDF">
                    {nobilisOrdenInfo?.pdfProtocol ? (
                        <object
                            data={pdfContent}
                            type="application/pdf"
                            width="400"
                            height="750"
                            className="PDF_SELECT"
                        >
                            <p>
                                Tu navegador no puede mostrar este archivo PDF.
                                Puedes descargarlo
                                <a href={pdfContent} download>
                                    aquí
                                </a>
                                .
                            </p>
                        </object>
                    ) : (
                        "ERROR"
                    )}
                    <div className="boton-pdf-volver">
                        <button onClick={() => navigate(-1)}>VOLVER</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
