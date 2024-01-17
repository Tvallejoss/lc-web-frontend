import config from "../../config";
import { importEncryptionKey, base64ToArrayBuffer } from "./index";

//FUNCION DECRYPT

// Función para descifrar datos
export const decryptData = async (key, iv, encryptedData) => {
    try {
        const importedKey = await importEncryptionKey(key);

        // Convertir las cadenas base64 a ArrayBuffer
        const ivArrayBuffer = base64ToArrayBuffer(iv);
        const encryptedArrayBuffer = base64ToArrayBuffer(encryptedData);

        const decryptedData = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivArrayBuffer },
            importedKey,
            encryptedArrayBuffer
        );

        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    } catch (error) {
        // console.error("Error decrypting data:", error);
        return null;
    }
};

// Función para descifrar varios objetos [{},{}]
export const decryptAll = async (data) => {
    try {
        const newDataDecrypted = await Promise.all(
            data.map(async (origen) => {
                const newOrigen = {};
                for (const key in origen) {
                    newOrigen[key] = await decryptData(
                        config.KEY,
                        origen[key].iv,
                        origen[key].encryptedData
                    );
                }
                return newOrigen;
            })
        );
        return newDataDecrypted;
    } catch (error) {
        console.error("Error decrypting all data:", error);
        return [];
    }
};

//FUNCION PARA DECRYPT UN OBJETO ENTERO {}
export const decryptObj = async (data) => {
    let newDataDecrypted = {};
    for (let key in data) {
        newDataDecrypted = {
            ...newDataDecrypted,
            [key]: await decryptData(
                config.KEY,
                data[key].iv,
                data[key].encryptedData
            ),
        };
    }
    return newDataDecrypted;
};
