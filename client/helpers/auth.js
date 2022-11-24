import cookie from "js-cookie";
import Router from "next/router";

// set in the cookie (when the user signs in)
export const setCookie = (key, value) => {
    if (process.browser) cookie.set(key, value, { expires: 1 });
};

// remove the cookie (when the user signs out)
export const removeCookie = (key) => {
    if (process.browser) cookie.remove(key);
};

// get from cookie such as stored token (to access the protected routes by the authorized user and this cookie helps us identify the authenticity of the user)
// it will be useful when we need to request server with auth token
export const getCookie = (key) => {
    if (process.browser) return cookie.get(key);
};

// set in local storage (when the user signs in)
export const setLocalStorage = (key, value) => {
    if (process.browser) localStorage.setItem(key, JSON.stringify(value));
};

// remove from local storage (when the user signs out)
export const removeLocalStorage = (key) => {
    if (process.browser) localStorage.removeItem(key);
};

// authenticate user by passing data to cookie and local storage during sign in
// here next is a callback function which is used to redirect the user to new page
export const authenticate = (response, next) => {
    setCookie("token", response.data.token); // save the token in the cookie (cookie is a more secure place as compared to local storage)
    setLocalStorage("user", response.data.user); // save the user in the local storage

    next();
};

// access user info from local storage
export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie("token"); // can't rely only on the local storage data, so we checkedd for cookie for security reasons
        if (cookieChecked) {
            if (localStorage.getItem("user"))
                return JSON.parse(localStorage.getItem("user"));
            else return false;
        }
    }
};

export const logout = () => {
    removeCookie("token");
    removeLocalStorage("user");
    Router.push("/login");
};
