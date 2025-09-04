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
  active: baseUrl + "/pockets/active",
};

export const transactionUrl = {
  list: baseUrl + "/transactions",
  create: baseUrl + "/transactions",
  get: baseUrl + "/transactions/" + ":id",
  update: baseUrl + "/transactions/" + ":id",
  delete: baseUrl + "/transactions/" + ":id",
};

export const spendingAnalyticsUrl = {
  summary: baseUrl + "/spending-analytics/summary",
  categoryBreakdown: baseUrl + "/spending-analytics/category-summary",
  monthlyTrend: baseUrl + "/spending-analytics/monthly-trend",
  dailyTrend: baseUrl + "/spending-analytics/daily-trend",
  recent: baseUrl + "/spending-analytics/recent",
};