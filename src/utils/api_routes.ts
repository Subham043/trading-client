/*
 * API routes list
 */

export const api_routes = {
  dashboard: "/",
  auth: {
    login: "/auth/login",
  },
  account: {
    profile: "/account/profile",
  },
} as const;
