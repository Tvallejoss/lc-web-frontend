export const addToken = (userInfo) => {
    const isUserLog = JSON.parse(localStorage.getItem("UserLoggedInfo"));
    return {
        ...userInfo,
        token: isUserLog,
    };
};
