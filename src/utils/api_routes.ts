/*
 * API routes list
 */

export const api_routes = {
  dashboard: "/",
  auth: {
    login: "/auth/login",
    forgot_password: "/auth/forgot-password",
    reset_password: "/auth/reset-password",
  },
  account: {
    profile: "/account/profile",
  },
} as const;
