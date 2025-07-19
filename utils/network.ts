// const baseUrl = "http://192.168.1.207:8000";
const baseUrl = "http://localhost:8000";

export const authUrl = {
  login: `${baseUrl}/auth/login`,
  register: `${baseUrl}/auth/register`,
};

export const userUrl = {
  me: baseUrl + "/users" + "/me",
  updateUsername: baseUrl + "/users" + "/name",
};

export const accountUrl = {
  list: baseUrl + "/account",
  add: baseUrl + "/account" + "/create",
  transfer: baseUrl + "/account" + "/transfer",
  addMoney: baseUrl + "/account" + "/add-money",
};
