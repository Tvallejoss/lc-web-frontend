import client from "../config/index";
// eslint-disable-next-line
import { encrypt, hashValue } from "./secure-data/crypt";

//FUNCION HANDLE
export const handleInputInfo = async (setLocalState, estado, { target }) => {
    //hashClave si el input es de typePassword
    if (target.name === "password") {
        const encryptedValue = await encrypt(
            client.KEY,
            // hashValue(target.value)
            target.value
        );
        setLocalState({
            ...estado,
            [target.name]: encryptedValue,
        });
        return;
    }

    if (target.name === "genero" || target.name === "urgente") {
        const encryptedValue = await encrypt(
            client.KEY,
            target.value.toUpperCase()
        );
        setLocalState({
            ...estado,
            [target.name]: encryptedValue,
        });
        return;
    }


    const encryptedValue = await encrypt(
        client.KEY,
        target.value.toLowerCase()
    );
    setLocalState({
        ...estado,
        [target.name]: encryptedValue,
    });
};
