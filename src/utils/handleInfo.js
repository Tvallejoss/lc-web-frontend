import client from "../config/index";
// eslint-disable-next-line
import { encrypt, hashValue } from "./secure-data/crypt";

//FUNCION HANDLE
export const handleInputInfo = async (setLocalState, estado, { target }) => {
    // Eliminar espacios adicionales al final, pero mantener los espacios entre palabras
    const trimmedValue = target.value.trimEnd();

    //hashClave si el input es de typePassword
    if (target.name === "password") {
        const encryptedValue = await encrypt(client.KEY, trimmedValue);
        setLocalState({
            ...estado,
            [target.name]: encryptedValue,
        });
        return;
    }

    if (target.name === "genero" || target.name === "urgente") {
        const encryptedValue = await encrypt(
            client.KEY,
            trimmedValue.toUpperCase()
        );
        setLocalState({
            ...estado,
            [target.name]: encryptedValue,
        });
        return;
    }

    const encryptedValue = await encrypt(
        client.KEY,
        trimmedValue.toLowerCase()
    );
    setLocalState({
        ...estado,
        [target.name]: encryptedValue,
    });
};
