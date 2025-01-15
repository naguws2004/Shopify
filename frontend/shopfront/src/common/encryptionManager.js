const CryptoJS = require('crypto-js');

const key = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef'); // Example key
const iv = CryptoJS.enc.Hex.parse('abcdef9876543210abcdef9876543210'); // Example IV

export const encryptObject = (obj) => {
  try {
    const jsonString = JSON.stringify(obj);
    const encrypted = CryptoJS.AES.encrypt(jsonString, key, { iv: iv }).toString();
    return { iv: iv.toString(CryptoJS.enc.Hex), encryptedData: encrypted };
  } catch (error) {
    console.error('Error encrypting object:', error);
    throw error;
  }
};

export const decryptObject = (encryptedObj) => {
  try {
    const iv = CryptoJS.enc.Hex.parse(encryptedObj.iv);
    const decrypted = CryptoJS.AES.decrypt(encryptedObj.encryptedData, key, { iv: iv });
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Error decrypting object:', error);
    throw error;
  }
};

export const encryptString = (str) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(str, key, { iv: iv }).toString();
    const base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
    return base64.replace(/\//g, '_').replace(/\\/g, '-');
  } catch (error) {
    console.error('Error encrypting string:', error);
    throw error;
  }
};

export const decryptString = (encryptedStr) => {
  try {
    const base64 = encryptedStr.replace(/_/g, '/').replace(/-/g, '\\');
    const encrypted = CryptoJS.enc.Base64.parse(base64).toString(CryptoJS.enc.Utf8);
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting string:', error);
    throw error;
  }
};