import Cookies from 'js-cookie';
import { encryptObject, decryptObject } from './encryptionManager';

export const setCookie = (name, object, options) => {
    const encryptedValue = JSON.stringify(encryptObject(object));
    Cookies.set(name, encryptedValue, options);
};

export const getCookie = (name) => {
    const encryptedValue = Cookies.get(name);
    if (!encryptedValue) {
        return undefined;
    }
    return decryptObject(JSON.parse(encryptedValue));
};

export const removeCookie = (name) => {
    Cookies.remove(name);
};