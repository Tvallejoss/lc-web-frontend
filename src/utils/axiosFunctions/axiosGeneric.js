import config from "../../config/";
import { decryptAll, decryptObj } from "../secure-data/decrypt";
import { sortDescByCuit } from "../sortDescByCuit ";

import axios from "axios";

//AXIOS CON SOLO ENVIO DE TOKEN
export const getDataFromAxios = async (
    RUTA_BACK,
    SET_ESTADO_LOCAL,
    SET_ESTADO_LOCAL_SINDECRYPT
) => {
    const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
    try {
        const { data } = await axios.post(
            config.IP + config.PUERTO + RUTA_BACK,
            { token }
        );

        if (Array.isArray(data)) {
            SET_ESTADO_LOCAL(await decryptAll(data));
            SET_ESTADO_LOCAL_SINDECRYPT(data);
            return await decryptAll(data);
        } else if (typeof data === "object" && data !== null) {
            SET_ESTADO_LOCAL(await decryptObj(data));
            SET_ESTADO_LOCAL_SINDECRYPT(data);
            return await decryptObj(data);
        }
    } catch (error) {
        console.log("Error Axios en ruta:" + RUTA_BACK, error);
        return error;
    }
};

export const getOrigenesFromAxios = async (
    setCampos,
    setAllCampos,
    setLoading
) => {
    const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
    try {
        const { data } = await axios.post(
            config.IP + config.PUERTO + "/origenesSimplificados",
            { token }
        );

        const origenesOrdenadosCuit = sortDescByCuit(await decryptAll(data));
        setCampos(origenesOrdenadosCuit);
        setAllCampos(origenesOrdenadosCuit);
    } catch (error) {
        console.log("Error Axios al traer origenes", error);
        return error;
    } finally {
        setLoading(false);
    }
};
