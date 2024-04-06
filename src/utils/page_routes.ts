/*
 * Page routes list
 */

export const page_routes = {
  dashboard: "/",
  users: "/users",
  companyMasters: {
    list: "/company-masters",
    view: "/company-masters/:companyId",
  },
  nameChangeMasters: {
    main: "/name-change-masters",
  },
  auth: {
    login: "/login",
    forgot_password: "/forgot-password",
    reset_password: "/reset-password/:key",
  },
  account: {
    profile: "/profile",
  },
} as const;
