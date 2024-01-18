import { jwtDecode } from "jwt-decode";

export const isAdmin = () => {
    const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
    const decoded = jwtDecode(token)
    if (
        Object.entries(token).length === 0 ||
        decoded.rol !== "ADMIN"
    ) {
        return false;
    }
    return true;
};
