// Recibe un arreglo de objetos
export const sortDescByCuit = (data) => {
    // Ordenamos el arreglo por el campo "cuit" en orden descendente
    data.sort((a, b) => Number(b.cuit) - Number(a.cuit));

    return data;
};
