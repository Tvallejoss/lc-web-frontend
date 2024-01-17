import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Login } from "./components/login/Login";
import { Menu } from "./components/menu/Menu";
import { UserInfo } from "./components/userInfo/UserInfo";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Derivaciones } from "./components/derivaciones/Derivaciones";
import { Excel } from "./components/excel/Excel";
import { TablaAdmin } from "./components/admin/tablaAdmin/TablaAdmin";
import { AddClient } from "./components/admin/clientInfo/AddClient.js";
import { PDFviewer } from "./components/pdf/PDFviewer";
import { ModificarClient } from "./components/admin/clientInfo/modificar/ModificarClient";
import { Ordenes } from "./components/ordenes/Ordenes";

//State functions
// import { setUserData } from "./state/user";
function App() {
    const navigate = useNavigate();
    // State global
    const user = useSelector((state) => state.user);

    useEffect(() => {
        // Validar el user en el Local Storage
        const isUserLog = JSON.parse(localStorage.getItem("UserLoggedInfo"));

        if (!isUserLog) {
            if (isUserLog !== user) {
                window.localStorage.setItem(
                    "UserLoggedInfo",
                    JSON.stringify(user)
                );
                return;
            }
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Login />
                        </>
                    }
                ></Route>

                <Route
                    path="/home"
                    element={
                        <>
                            {" "}
                            <Menu />
                        </>
                    }
                ></Route>
                <Route
                    path="/dashboard"
                    element={
                        <>
                            <Dashboard />
                        </>
                    }
                ></Route>

                <Route
                    path="/user"
                    element={
                        <>
                            <UserInfo />
                        </>
                    }
                ></Route>

                <Route
                    path="/derivaciones"
                    element={
                        <>
                            <Derivaciones />
                        </>
                    }
                ></Route>

                <Route
                    path="/excel"
                    element={
                        <>
                            <Excel />
                        </>
                    }
                ></Route>

                <Route
                    path="/ADMIN"
                    element={
                        <>
                            <TablaAdmin />
                        </>
                    }
                ></Route>

                <Route
                    path="/ADMIN/client"
                    element={
                        <>
                            <AddClient />
                        </>
                    }
                ></Route>
                <Route
                    path="/PDF_PACIENTE/:pdf"
                    element={
                        <>
                            <PDFviewer />
                        </>
                    }
                ></Route>

                <Route
                    path="/dashboard/:idDerivacion"
                    element={
                        <>
                            <Ordenes />
                        </>
                    }
                ></Route>

                <Route
                    path="/cliente/:cuit"
                    element={
                        <>
                            <ModificarClient />
                        </>
                    }
                ></Route>
            </Routes>
        </>
    );
}

export default App;
