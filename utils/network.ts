// const baseUrl = "http://192.168.1.207:8000";
const baseUrl = "http://localhost:8000";

export const authUrl = {
  login: `${baseUrl}/auth/login`,
  register: `${baseUrl}/auth/register`,
};

export const userUrl = {
  me: baseUrl + "/users" + "/me",
  updateUsername: baseUrl + "/users" + "/name",
  updateHideBalance: baseUrl + "/users/hide-balance"
};

export const pocketUrl = {
  list: baseUrl + "/pockets",
  add: baseUrl + "/pockets",
  update: baseUrl + "/pockets/" + ":id",
  delete: baseUrl + "/pockets/" + ":id",
};