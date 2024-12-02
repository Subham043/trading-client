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
  pincodes: "/pincodes",
  stageNames: "/stage-names",
  users: "/users",
  projects: "/projects",
  companyMasters: "/company-masters",
  nameChangeMasters: "/name-change-masters",
  registrarMasters: "/registrar-masters",
  registrarMasterBranches: "/registrar-master-branches",
  corporateMasters: "/corporate-masters",
  dividendMasters: "/dividend-masters",
  shareCertificateMasters: "/share-certificate-masters",
  shareHolderMasters: "/share-holder-masters",
  shareHolderDetails: "/share-holder-details",
  legalHeirDetails: "/legal-heir-details",
  cases: "/cases",
  folios: "/folios",
  securityTypeMasters: "/security-type-masters",
  stageTrackers: "/stage-trackers",
  paymentTrackers: "/payment-trackers",
  paymentTrackerStages: "/payment-tracker-stages",
  referralTrackerStages: "/referral-tracker-stages",
  upload: {
    images: "/upload/images",
    failed_excel: {
      download_via_name: "/upload/failed-excel/download-via-name",
      download_via_id: "/upload/failed-excel/download-via-id",
      list: "/upload/failed-excel/list",
    },
  },
} as const;
