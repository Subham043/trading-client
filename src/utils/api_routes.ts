/*
 * API routes list
 */

export const api_routes = {
  dashboard: "/",
  auth: {
    login: "/auth/login",
    forgot_password: "/auth/forgot-password",
    reset_password: "/auth/reset-password",
    logout: "/auth/logout",
  },
  account: {
    profile: "/account/profile",
    password: "/account/password",
  },
  users: "/users",
  companyMasters: "/company-masters",
  nameChangeMasters: "/name-change-masters",
  registrarMasters: "/registrar-masters",
  excel: {
    failed: "/excel/failed",
  },
} as const;
