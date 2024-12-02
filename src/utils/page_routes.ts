/*
 * Page routes list
 */

export const page_routes = {
  dashboard: "/",
  users: "/users",
  pincodes: "/pincodes",
  stageNames: "/stage-names",
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
    legalHeirDetails: "/projects/:projectId/legal-heir-details",
    paymentTrackers: "/projects/:projectId/payment-trackers",
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
  paymentTrackers: {
    list: "/payment-trackers",
    view: "/payment-trackers/:paymentTrackerId",
  },
  paymentTrackerStages: {
    list: "/payment-tracker-stages",
    view: "/payment-tracker-stages/:paymentTrackerStageId",
  },
  referralTrackerStages: {
    list: "/referral-tracker-stages",
    view: "/referral-tracker-stages/:referralTrackerStageId",
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
