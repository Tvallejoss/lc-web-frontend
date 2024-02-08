import React from "react";
import Modal from "react-modal";
import "./LogOut.css";

export const LogOut = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            style={{
                overlay: {
                    zIndex: 10,
                },
                content: {
                    width: "400px",
                    height: "150px",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                },
            }}
        >
            <div className="MODAL_LOGOUT">
                <h2>¿Estás seguro de que deseas cerrar sesión?</h2>
                <div className="BOTONES_MODAL">
                    <button onClick={onConfirm}>Sí</button>
                    <button onClick={onClose}>No</button>
                </div>
            </div>
        </Modal>
    );
};
