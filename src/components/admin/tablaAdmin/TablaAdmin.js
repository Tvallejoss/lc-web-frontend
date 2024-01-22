// Hooks
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SyncLoader } from "react-spinners";
import { logOut } from "../../../utils/auth/logOut";
import { isAdmin } from "../../../utils/auth/isAdmin";
import { getOrigenesFromAxios } from "../../../utils/axiosFunctions/axiosGeneric";
import useMediaQuery from "../../../utils/mediaQuery/useMediaQuery";

// Styles
import classes from "./TablaAdmin.module.css";

// Components
import { NavLogo } from "../../navLogo/NavLogo";
import { Campos } from "./campos/Campos";
import { LogOut } from "../../logOut/LogOut";
import { TablaAdminMobile } from "../../mobile/admin/TablaAdminMobile";
import { OptionsPopover } from "../../mobile/admin/popUpAdminFiles/OptionsPopover";
const ModalCargando = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
                width: "100%",
            }}
        >
            <div>
                <SyncLoader size={8} color={"#0b74d1"} loading={true} />
            </div>
        </div>
    );
};

export const TablaAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const user = useSelector((state) => state.user);
    const [campos, setCampos] = useState([]);
    const [allCampos, setAllCampos] = useState([]);
    const [search, setSearch] = useState("");
    const [filtro, setFiltro] = useState("cuit");
    const [estado, setEstado] = useState(false);
    const [loading, setLoading] = useState(true);

    // Mobile
    const isDesktop = useMediaQuery("(min-width: 1000px)");

    //Modal Functions
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const handleLogout = () => {
        setIsConfirmationOpen(true);
    };
    const handleConfirmLogout = () => {
        logOut(dispatch, navigate);
        setIsConfirmationOpen(false);
    };
    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false);
    };

    // PopUp Functions/states
    const [isOpen, setOpen] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);

    const openPopover = () => {
        setOpen(true);
    };

    const closePopover = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (search) {
            const filteredOrigenes = allCampos.filter((origen) => {
                return origen[filtro]
                    .toLowerCase()
                    .includes(search.toLowerCase());
            });
            setCampos(filteredOrigenes);
            return;
        } else {
            setCampos(allCampos);
        }
    }, [search]);

    useEffect(() => {
        if (!isAdmin()) {
            navigate("/home");
            return;
        }

        getOrigenesFromAxios(setCampos, setAllCampos, setLoading);
    }, [estado, setEstado, loading]);

    //VIEW MOBILE
    if (!isDesktop) return <TablaAdminMobile data={campos} />;
    return (
        <div className={classes["BOX_TABLA_ADMIN"]}>
            <NavLogo palabra={""} />

            <div className={classes["NAV_TABLA_ADMIN"]}>
                <div>
                    <span>Filtrar por:</span>
                    <select
                        className={classes["filtro_admin"]}
                        name="filtro"
                        onChange={(e) => setFiltro(e.target.value)}
                    >
                        <option value="cuit">Cuit</option>
                        <option value="usernameDeUsuario">Nombre</option>
                        <option value="mail">email</option>
                    </select>

                    <div>
                        <input
                            placeholder="Buscar"
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <Link to="/ADMIN/client" className={classes["A_Table"]}>
                            <p> + Alta nuevo cliente </p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={classes["TABLE"]}>
                <div className={classes["TABLA_D"]}>
                    <ol className={classes["Campos"]}>
                        <li>Cuit Cliente</li>
                        <li>Estado</li>
                        <li>Nombre</li>
                        <li>Contacto</li>
                        <li>mail</li>
                        <li>Acciones</li>
                    </ol>

                    {loading ? (
                        <ModalCargando />
                    ) : campos.length ? (
                        campos.map((field, i) => {
                            return (
                                <Campos
                                    cliente={field}
                                    setEstado={setEstado}
                                    setLoading={setLoading}
                                    key={i}
                                />
                            );
                        })
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <button className={classes["SALIR"]} onClick={handleLogout}>
                Salir
            </button>
            <div className={classes["popUp-container"]}>
                <div
                    ref={setReferenceElement}
                    onClick={openPopover}
                    className={classes["popUp-text"]}
                >
                    Subir Archivos
                </div>
                <OptionsPopover
                    isOpen={isOpen}
                    onClose={closePopover}
                    referenceElement={referenceElement}
                />
            </div>

            <LogOut
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
};
