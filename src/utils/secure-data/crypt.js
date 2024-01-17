import { importEncryptionKey, arrayBufferToBase64 } from "./index";

//USANDO sha256
let sha256 = require("js-sha256");

//hash
export const hashValue = (value) => {
    var hash = sha256.create();
    hash.update(value);
    return hash.hex();
};

//FUNCION DE ENCRYPT
export async function encrypt(key, data) {
    const importedKey = await importEncryptionKey(key);

    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = encoder.encode(data);

    const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        importedKey,
        encodedData
    );

    // Convertir los datos cifrados a formato base64
    const encryptedBase64 = arrayBufferToBase64(encryptedData);

    return {
        iv: arrayBufferToBase64(iv.buffer),
        encryptedData: encryptedBase64,
    };
}
