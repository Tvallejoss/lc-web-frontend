import React from "react";
import Modal from "react-modal";

export const ModalEstado = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            style={{
                content: {
                    width: "400px",
                    height: "150px",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                },
            }}
        >
            <div className="MODAL_LOGOUT">
                <h2>¿Seguro quieres cambiar el estado del origen?</h2>
                <div className="BOTONES_MODAL">
                    <button onClick={onConfirm}>SI</button>
                    <button onClick={onClose}>NO</button>
                </div>
            </div>
        </Modal>
    );
};
