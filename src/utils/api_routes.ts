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
  upload: {
    failed_excel: {
      download_via_name: "/upload/failed-excel/download-via-name",
      download_via_id: "/upload/failed-excel/download-via-id",
      list: "/upload/failed-excel/list",
    },
  },
} as const;
