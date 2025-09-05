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

export const expenseAnalyticsUrl = {
  summary: baseUrl + "/expense-analytics/summary",
  categoryBreakdown: baseUrl + "/expense-analytics/category-summary",
  monthlyTrend: baseUrl + "/expense-analytics/monthly-trend",
  dailyTrend: baseUrl + "/expense-analytics/daily-trend",
  recent: baseUrl + "/expense-analytics/recent",
};

export const incomeAnalyticsUrl = {
  summary: baseUrl + "/income-analytics/summary",
  categoryBreakdown: baseUrl + "/income-analytics/category-summary",
  monthlyTrend: baseUrl + "/income-analytics/monthly-trend",
  dailyTrend: baseUrl + "/income-analytics/daily-trend",
  recent: baseUrl + "/income-analytics/recent",
};