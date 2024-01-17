import { setUserData } from "../../state/user";

export const logOut = (DISPATCH, navigate) => {
    DISPATCH(setUserData({}));
    window.localStorage.setItem("UserLoggedInfo", JSON.stringify({}));
    navigate("/");
};
