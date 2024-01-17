export async function importEncryptionKey(key) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);

    // Importar la clave de cifrado utilizando la función window.crypto.subtle.importKey
    const importedKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        "AES-GCM",
        true,
        ["decrypt", "encrypt"]
    );

    return importedKey;
}

// Función para convertir un ArrayBuffer a base64
/* export function arrayBufferToBase64(buffer) {
    const binaryArray = new Uint8Array(buffer);
    const base64 = btoa(String.fromCharCode(...binaryArray));
    return base64;
} */

// Función para convertir un ArrayBuffer a base64 PDF SOLUCION
export function arrayBufferToBase64(buffer) {
    const binaryArray = new Uint8Array(buffer);
    let base64 = "";
    for (let i = 0; i < binaryArray.length; i++) {
        base64 += String.fromCharCode(binaryArray[i]);
    }
    return btoa(base64);
}

// Función para convertir una cadena base64 a ArrayBuffer
export function base64ToArrayBuffer(base64) {
    try {
        const padding = "=".repeat((4 - (base64.length % 4)) % 4);
        const base64Url = (base64 + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const binaryString = atob(base64Url);

        const buffer = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            buffer[i] = binaryString.charCodeAt(i);
        }

        return buffer.buffer;
    } catch (error) {
        // console.error("Error decoding base64:", error);
        return null;
    }
}
