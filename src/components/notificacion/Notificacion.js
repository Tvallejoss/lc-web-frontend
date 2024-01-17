import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//NOTIFICACION
export const showToastMessage = (type, msg) => {
    toast[type](msg, {
        position: toast.POSITION.TOP_RIGHT,
    });
    /*    const myPromise = new Promise((resolve) =>
        fetch("https://jsonplaceholder.typicode.com/post")
            .then((response) => response.json())
            .then((json) => setTimeout(() => resolve(json), 3000))
    );

    toast.promise(myPromise, {
        pending: "Validando...",
        success: "Usuario logueado",
        error: "error",
    }); */
};
