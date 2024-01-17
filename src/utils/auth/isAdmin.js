const jwt = require("jsonwebtoken");

export const isAdmin = () => {
    const token = JSON.parse(localStorage.getItem("UserLoggedInfo"));
    if (
        Object.entries(token).length === 0 ||
        jwt.decode(token).rol !== "ADMIN"
    ) {
        return false;
    }
    return true;
};
