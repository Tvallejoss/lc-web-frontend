// Hooks
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pako from "pako";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

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

    //State Global
    const pdfGlobal = useSelector((state) => state.pdfByOrdenSelected);

    console.log("ORDEN PDF", pdfGlobal);

    useEffect(() => {
        if (pdf) {
            try {
                const arrayNumerico = pdf.split(",").map(Number);
                const uncompressedPdf = pako.inflate(arrayNumerico, {
                    to: "string",
                });

                setPdfContent("data:application/pdf;base64," + uncompressedPdf);
            } catch (error) {
                console.error("Error al descomprimir el PDF:", error);
            }
        } else {
            console.error("El valor de pdf es nulo o indefinido.");
        }
    }, [pdf]);

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

                    <div className="boton-pdf-volver">
                        <button onClick={() => navigate(-1)}>VOLVER</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
