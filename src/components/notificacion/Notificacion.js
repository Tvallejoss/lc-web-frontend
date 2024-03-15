import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//NOTIFICACION
export const showToastMessage = (type, msg) => {
    toast[type](msg, {
        position: "top-right",
    });
};
