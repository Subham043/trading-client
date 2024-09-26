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
    nameChangeMaster: "/company-masters/:companyId/name-change-masters",
    corporateMaster: "/company-masters/:companyId/corporate-masters",
    dividendMaster: "/company-masters/:companyId/dividend-masters",
  },
  projects: {
    list: "/projects",
    view: "/projects/:projectId",
    shareCertificateMaster: "/projects/:projectId/share-certificate-masters",
    shareHolderDetails: "/projects/:projectId/share-holder-details",
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
  shareHolderMasters: {
    list: "/share-holder-masters",
    view: "/share-holder-masters/:shareHolderMasterId",
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
