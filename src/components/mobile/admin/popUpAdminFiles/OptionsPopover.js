// Hooks
import React, { useRef } from "react";
import { uploadExcel } from "../../../../utils/files/uploadFiles/uploadExcel";
import { uploadPdf } from "../../../../utils/files/uploadFiles/uploadPdf";

// Styles
import classes from "./OptionsPopover.module.css";

export const OptionsPopover = ({
    isOpen,
    onClose,
    referenceElement,
    popperElement,
}) => {
    const fileInputRefExcel = useRef(null);
    const fileInputRefPDF = useRef(null);

    const handleButtonClickExcel = () => {
        fileInputRefExcel.current.click();
    };

    const handleButtonClickPDF = () => {
        fileInputRefPDF.current.click();
    };

    return isOpen ? (
        <div ref={popperElement} className={classes["popUp-component"]}>
            <div>
                <p onClick={handleButtonClickExcel}>Excel Template</p>
                <input
                    type="file"
                    ref={fileInputRefExcel}
                    style={{ display: "none" }}
                    accept=".xlsx"
                    onChange={uploadExcel}
                    onClick={(e) => (e.target.value = null)}
                />
            </div>

            <div>
                <p onClick={handleButtonClickPDF}>Instructivo</p>
                <input
                    type="file"
                    ref={fileInputRefPDF}
                    style={{ display: "none" }}
                    accept=".pdf"
                    onChange={uploadPdf}
                    onClick={(e) => (e.target.value = null)}
                />
            </div>

            <button onClick={onClose}>Cerrar</button>
        </div>
    ) : null;
};
