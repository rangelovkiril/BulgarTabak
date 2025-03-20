import config from "../config/config";

export const getToken = () => {
  return localStorage.getItem(config.tokenKey);
};

export const setToken = (token) => {
  localStorage.setItem(config.tokenKey, token);
};

export const removeToken = () => {
  localStorage.removeItem(config.tokenKey);
};

export const isAuthenticated = () => {
  const token = getToken();
  return token !== null;
};
