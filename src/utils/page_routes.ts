/*
 * Page routes list
 */

export const page_routes = {
  dashboard: "/",
  users: "/users",
  companyMasters: "/company-masters",
  auth: {
    login: "/login",
    forgot_password: "/forgot-password",
    reset_password: "/reset-password/:key",
  },
  account: {
    profile: "/profile",
  },
} as const;
