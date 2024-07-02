/*
 * Page routes list
 */

export const page_routes = {
  dashboard: "/",
  users: "/users",
  pincodes: "/pincodes",
  failed_excel: "/failed-excel",
  companyMasters: {
    list: "/company-masters",
    view: "/company-masters/:companyId",
  },
  registrarMasters: {
    list: "/registrar-masters",
    view: "/registrar-masters/:registrarMasterId",
  },
  nameChangeMasters: {
    main: "/name-change-masters",
  },
  securityTypeMasters: {
    list: "/security-type-masters",
  },
  shareCertificateMasters: {
    list: "/share-certificate-masters",
    view: "/share-certificate-masters/:shareCertificateMasterId",
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
