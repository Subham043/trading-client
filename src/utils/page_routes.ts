/*
 * Page routes list
 */

export const page_routes = {
  dashboard: "/",
  auth: {
    login: "/login",
    forgot_password: "/forgot-password",
    reset_password: "/reset-password",
  },
  account: {
    profile: "/profile",
  },
} as const;
