export const getFileName = (nombreArchivo) => {
    return nombreArchivo.replace(/\.[^.]*$/, "");
};
