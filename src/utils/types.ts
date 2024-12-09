import { AxiosResponse } from "axios";
import { ReactNode } from "react";

export type ChildrenType = {
  children: ReactNode;
};

export type CommonDrawerProps =
  | {
      status: boolean;
      type: "Create";
    }
  | {
      status: boolean;
      type: "Edit";
      id: number;
    };

export type UserType = {
  access_token: string;
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

export type CompanyMasterQueryType = {
  id: number;
  registrarMasterBranch: {
    branch: string | null;
    city: string | null;
    pincode: string | null;
    state: string | null;
    address: string | null;
    nameContactPerson: string | null;
    emailContactPerson: string | null;
    phoneContactPerson: string | null;
    id: number;
    registrarMaster: {
      id: number;
      registrar_name: string;
      sebi_regn_id: string;
    } | null;
  } | null;
  nameChangeMasters: {
    id: number;
    NSE: string | null;
    BSE: string | null;
    dateNameChange: Date | null;
    currentName: string | null;
    previousName: string | null;
  }[];
  currentNameChangeMasters: {
    id: number;
    NSE: string | null;
    BSE: string | null;
    dateNameChange: Date | null;
    currentName: string | null;
    previousName: string | null;
  } | null;
  CIN: string | null;
  ISIN: string | null;
  faceValue: number | null;
  closingPriceNSE: number | null;
  closingPriceBSE: number | null;
  registeredOffice: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  telephone: string | null;
  fax: string | null;
  email: string | null;
  website: string | null;
  nameContactPerson: string | null;
  designationContactPerson: string | null;
  emailContactPerson: string | null;
  phoneContactPerson: string | null;
  createdAt: Date | null;
};

export type CompanyMasterType = {
  id: number;
  currentName?: string | undefined;
  BSE?: string | undefined;
  NSE?: string | undefined;
  CIN?: string | undefined;
  ISIN?: string | undefined;
  faceValue?: number | undefined;
  closingPriceNSE?: number | undefined;
  closingPriceBSE?: number | undefined;
  registeredOffice?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  pincode?: number | undefined;
  telephone?: string | undefined;
  fax?: string | undefined;
  email?: string | undefined;
  website?: string | undefined;
  nameContactPerson?: string | undefined;
  designationContactPerson?: string | undefined;
  emailContactPerson?: string | undefined;
  phoneContactPerson?: string | undefined;
  createdAt: string;
  nameChangeMasterId?: number | undefined;
  registrar_branch?: string | undefined;
  registrar_city?: string | undefined;
  registrar_pincodes?: string | undefined;
  registrar_state?: string | undefined;
  registrarMasterBranchId?: number | undefined;
  registrarMasterId?: number | undefined;
  registrar_name?: string | undefined;
  sebi_regn_id?: string | undefined;
};

export type CompanyMasterFormType = Omit<
  CompanyMasterType,
  | "id"
  | "createdAt"
  | "registrar_branch"
  | "registrar_pincodes"
  | "registrar_state"
  | "registrar_city"
  | "registrarMasterId"
  | "registrar_name"
  | "sebi_regn_id"
>;

export type NameChangeMasterQueryType = {
  id: number;
  registrarMasterBranch: {
    branch: string | null;
    city: string | null;
    pincode: string | null;
    state: string | null;
    id: number;
    registrarMaster: {
      id: number;
      registrar_name: string;
      sebi_regn_id: string;
    } | null;
  } | null;
  nameChangeMasters: {
    id: number;
    NSE: string | null;
    BSE: string | null;
    dateNameChange: Date | null;
    currentName: string | null;
    previousName: string | null;
  }[];
  currentNameChangeMasters: {
    id: number;
    NSE: string | null;
    BSE: string | null;
    dateNameChange: Date | null;
    currentName: string | null;
    previousName: string | null;
  } | null;
  CIN: string | null;
  ISIN: string | null;
  faceValue: number | null;
  closingPriceNSE: number | null;
  closingPriceBSE: number | null;
  registeredOffice: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  telephone: string | null;
  fax: string | null;
  email: string | null;
  website: string | null;
  nameContactPerson: string | null;
  designationContactPerson: string | null;
  emailContactPerson: string | null;
  phoneContactPerson: string | null;
  createdAt: Date | null;
};

export type NameChangeMasterType = {
  id: number;
  currentName?: string | undefined;
  previousName?: string | undefined;
  dateNameChange?: string | undefined;
  BSE?: string | undefined;
  NSE?: string | undefined;
  companyId: number;
  createdAt: string;
};

export type NameChangeMasterFormType = Omit<
  NameChangeMasterType,
  "id" | "createdAt" | "companyId"
>;

export type RegistrarMasterType = {
  id: number;
  registrar_name: string;
  sebi_regn_id: string;
  createdAt?: Date;
};

export interface RegistrarMasterFormType
  extends Omit<RegistrarMasterType, "id" | "createdAt"> {}

export type RegistrarMasterBranchQueryType = {
  id: number;
  address?: string | null | undefined;
  city?: string | null | undefined;
  state?: string | null | undefined;
  pincode?: string | null | undefined;
  telephone1?: string | null | undefined;
  telephone2?: string | null | undefined;
  email?: string | null | undefined;
  website?: string | null | undefined;
  nameContactPerson?: string | null | undefined;
  designationContactPerson?: string | null | undefined;
  emailContactPerson?: string | null | undefined;
  phoneContactPerson?: string | null | undefined;
  officerAssigned?: string | null | undefined;
  branch: string | null | undefined;
  createdAt?: Date | null;
  registrarMasterID?: number | null | undefined;
  registrarMaster: {
    registrar_name: string;
    sebi_regn_id: string;
  } | null;
};

export type RegistrarMasterBranchType = {
  id: number;
  registrar_name: string;
  sebi_regn_id: string;
  address?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  pincode?: string | undefined;
  telephone1?: string | undefined;
  telephone2?: string | undefined;
  email?: string | undefined;
  website?: string | undefined;
  nameContactPerson?: string | undefined;
  designationContactPerson?: string | undefined;
  emailContactPerson?: string | undefined;
  phoneContactPerson?: string | undefined;
  officerAssigned?: string | undefined;
  branch: string;
  createdAt: Date;
  registrarMasterId?: number | undefined;
};

export interface RegistrarMasterBranchFormType
  extends Omit<
    RegistrarMasterBranchType,
    | "id"
    | "createdAt"
    | "registrarMasterId"
    | "registrar_name"
    | "sebi_regn_id"
    | "pincode"
  > {
  pincode?: number | undefined;
}

export type SecurityTypeMasterType = {
  id: number;
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
  Symbol?: string | null;
  Series?: string | null;
  securityName?: string | null;
  dateOfListing?: Date | null;
  dateOfAllotment?: Date | null;
  redemptionDate?: Date | null;
  conversionDate?: Date | null;
  paidUpValue: number | null;
  dividend: number | null;
  redemptionAmount: number | null;
  conversionAmount: number | null;
  marketLot?: string | null;
  isinNumber?: string | null;
  distinctiveNosFrom?: string | null;
  distinctiveNosTo?: string | null;
  companyMaster?: CompanyMasterQueryType | null;
  companyID?: number | null;
  createdAt?: Date | null;
};

export interface SecurityTypeMasterFormType
  extends Omit<SecurityTypeMasterType, "id" | "createdAt" | "companyMaster"> {}

export type ShareCertificateMasterType = {
  id: number;
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
  companyMaster?: CompanyMasterQueryType | null;
  companyID?: number | null;
  projectID?: number | null;
  createdAt?: Date | null;
};

export interface ShareCertificateMasterFormType
  extends Omit<
    ShareCertificateMasterType,
    "id" | "createdAt" | "companyMaster" | "projectID"
  > {}

export type FolioType = {
  id: number;
  equityType: "Bonus" | "Shares" | "Splits" | "Rights";
  Folio?: string | null;
  certificateNumber?: string | null;
  certificateSerialNumber?: string | null;
  shareholderName1ID?: number | null;
  shareholderName1?: ShareHolderDetailType | null;
  shareholderName2ID?: number | null;
  shareholderName2?: ShareHolderDetailType | null;
  shareholderName3ID?: number | null;
  shareholderName3?: ShareHolderDetailType | null;
  noOfShares?: string | null;
  noOfSharesWords?: string | null;
  dateOfAllotment?: Date | null;
  faceValue: number | null;
  distinctiveNosFrom?: string | null;
  distinctiveNosTo?: string | null;
  endorsement: "Yes" | "No";
  endorsementFolio?: string | null;
  endorsementDate?: Date | null;
  endorsementShareholderName1ID?: number | null;
  endorsementShareholderName1?: ShareHolderDetailType | null;
  endorsementShareholderName2ID?: number | null;
  endorsementShareholderName2?: ShareHolderDetailType | null;
  endorsementShareholderName3ID?: number | null;
  endorsementShareholderName3?: ShareHolderDetailType | null;
  shareCertificateMaster?: ShareCertificateMasterType | null;
  shareCertificateID?: number | null;
  createdAt?: Date | null;
};

export interface FolioFormType
  extends Omit<FolioType, "id" | "createdAt" | "shareCertificateMaster"> {}

export type FolioCorporateMasterType = {
  type: "Equity" | "Bonus" | "Splits" | "Rights" | "ShareBought";
  date: Date;
  numerator?: string | null;
  denominator?: string | null;
  originalHolding?: string | null;
  exchange?: string | null;
  consolidatedHolding?: string | null;
};

export type FolioDividendMasterType = {
  recorded_date: string;
  financial_year?: string | null;
  dividend_per_share?: string | null;
  no_of_shares?: string | null;
  total_dividend?: string | null;
  cumulative_dividend?: string | null;
};

export type CorporateMasterType = {
  id: number;
  type: "Equity" | "Bonus" | "Splits" | "Rights" | "ShareBought";
  date: Date;
  numerator?: string | null;
  denominator?: string | null;
  companyID?: number | null;
  createdAt?: Date | null;
};

export interface CorporateMasterFormType
  extends Omit<
    CorporateMasterType,
    "id" | "date" | "numerator" | "denominator" | "createdAt" | "companyID"
  > {
  date: string;
  numerator: number;
  denominator: number;
}

export type DividendMasterType = {
  id: number;
  recorded_date: Date;
  financial_year?: string | null;
  dividend_per_share?: string | null;
  companyID?: number | null;
  createdAt?: Date | null;
};

export interface DividendMasterFormType
  extends Omit<
    DividendMasterType,
    | "id"
    | "recorded_date"
    | "financial_year"
    | "dividend_per_share"
    | "createdAt"
    | "companyID"
  > {
  recorded_date: string;
  financial_year: string;
  dividend_per_share: number;
}

export type ProjectType = {
  id: number;
  name: string;
  userID?: number | null;
  createdAt?: Date | null;
};

export interface ProjectFormType
  extends Omit<ProjectType, "id" | "createdAt" | "userID"> {}

export type CaseType = {
  id: number;
  caseType: string;
  folios?: string | null;
  transpositionOrder?: string | null;
  isDeceased?: string | null;
  shareholderNameDeath?: string | null;
  dod?: string | null;
  placeOfDeath?: string | null;
  isTestate?: string | null;
  proofOfSucession?: string | null;
  document?: string | null;
  dateOfDocument?: string | null;
  isMinor?: string | null;
  dobMinor?: string | null;
  guardianName?: string | null;
  guardianRelationship?: string | null;
  guardianPan?: string | null;
  deceasedRelationship?: string | null;
  taxStatus?: string | null;
  allowAffidavit?: string | null;
  selectClaimant?: string | null;
  selectAffidavitShareholder?: string | null;
  selectAffidavitLegalHeir?: string | null;
  statusClaimant?: string | null;
  percentageClaimant?: string | null;
  occupationClaimant?: string | null;
  politicalExposureClaimant?: string | null;
  annualIncomeClaimant?: string | null;
  shareCertificateID?: number | null;
  deadShareholderID?: number | null;
  deadShareholder?: ShareHolderDetailType | null;
  createdAt?: Date | null;
};

export interface CaseFormType
  extends Omit<
    CaseType,
    "id" | "transpositionOrder" | "shareCertificateID" | "createdAt"
  > {}

export type ShareHolderDetailType = {
  id: number;
  shareholderName?: string | null;
  shareholderNameCertificate?: string | null;
  namePan?: string | null;
  nameAadhar?: string | null;
  nameCml?: string | null;
  husbandName?: string | null;
  occupation?: string | null;
  phone?: string | null;
  email?: string | null;
  aadhar?: string | null;
  pan?: string | null;
  dob?: string | null;
  age?: string | null;
  nationality?: string | null;
  placeOfBirth?: string | null;
  city?: string | null;
  state?: string | null;
  countryOfBirth?: string | null;
  DPID?: string | null;
  dematAccountNo?: string | null;
  bankName?: string | null;
  branchName?: string | null;
  nameBank?: string | null;
  bankAddress?: string | null;
  bankEmail?: string | null;
  bankPhone?: string | null;
  bankMICR?: string | null;
  bankIFS?: string | null;
  accountOpeningDate?: string | null;
  bankAccountNo?: string | null;
  bankAccountType?: string | null;
  addressBank?: string | null;
  emailBank?: string | null;
  phoneBank?: string | null;
  pincodeBank?: string | null;
  projectID?: number | null;
  createdAt?: Date | null;
  addressAadhar?: string | null;
  CIN?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  fatherFirstName?: string | null;
  fatherMiddleName?: string | null;
  fatherLastName?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  hintQuestion?: string | null;
  hintAnswer?: string | null;
  isCompany?: string | null;
};

export interface ShareHolderDetailFormType
  extends Omit<
    ShareHolderDetailType,
    | "id"
    | "projectID"
    | "createdAt"
  > {}

export type LegalHeirDetailType = {
  id: number;
  namePan?: string | null;
  nameAadhar?: string | null;
  nameCml?: string | null;
  husbandName?: string | null;
  occupation?: string | null;
  phone?: string | null;
  email?: string | null;
  aadhar?: string | null;
  pan?: string | null;
  dob?: string | null;
  age?: string | null;
  nationality?: string | null;
  placeOfBirth?: string | null;
  city?: string | null;
  state?: string | null;
  countryOfBirth?: string | null;
  DPID?: string | null;
  dematAccountNo?: string | null;
  bankName?: string | null;
  branchName?: string | null;
  nameBank?: string | null;
  bankAddress?: string | null;
  bankEmail?: string | null;
  bankPhone?: string | null;
  bankMICR?: string | null;
  bankIFS?: string | null;
  accountOpeningDate?: string | null;
  bankAccountNo?: string | null;
  bankAccountType?: string | null;
  addressBank?: string | null;
  emailBank?: string | null;
  phoneBank?: string | null;
  pincodeBank?: string | null;
  projectID?: number | null;
  createdAt?: Date | null;
  addressAadhar?: string | null;
  CIN?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  fatherFirstName?: string | null;
  fatherMiddleName?: string | null;
  fatherLastName?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  hintQuestion?: string | null;
  hintAnswer?: string | null;
};

export interface LegalHeirDetailFormType
  extends Omit<
    LegalHeirDetailType,
    | "id"
    | "projectID"
    | "createdAt"
  > {}

export type FailedExcelType = {
  id: number;
  file_name: string;
  file_of: string;
  createdAt?: Date;
};

export type AxiosSuccessResponseType<T> = {
  message: string;
  code: number;
  success: true;
  data?: T;
};

export type AxiosErrorResponseType = {
  message: string;
  code: number;
  success: false;
  formErrors?: Record<string, string[]>;
};

export type AxiosResponseType<T> = AxiosResponse<
  AxiosSuccessResponseType<T>,
  AxiosErrorResponseType
>;

export type ApiPaginationQueryType = {
  page?: string;
  limit?: string;
  search?: string;
};

export type UserQueryType = {
  id: number;
  name: string;
  email: string;
  status: "active" | "blocked";
  role: "user" | "admin";
  createdAt: Date;
};

export type PincodeQueryType = {
  id: number;
  circle_name: string;
  region_name: string;
  division_name: string;
  office_name: string;
  pincode: string;
  office_type: string;
  district: string;
  state_name: string;
  createdAt: Date;
};

export type StageNameQueryType = {
  id: number;
  name: string;
  createdAt: Date;
};

export type StageTrackerType = {
  id: number;
  stage: string;
  comments: string | null;
  date: string | null;
  pendingFrom: "Client" | "RTA" | "IEPF" | "ServiceProvider";
  projectID: number;
  createdAt: Date;
};

export interface StageTrackerFormType
  extends Omit<StageTrackerType, "id" | "projectID" | "createdAt"> {}

  export type CommunicationTrackerType = {
    id: number;
    comments: string | null;
    dateSent: string | null;
    folios: string | null;
    dateReceived: string | null;
    stage: "DocumentsCouriered" | "DocumentsReceived";
    foliosSet: {
      id: number;
      equityType: "Bonus" | "Shares" | "Splits" | "Rights";
      Folio: string;
      certificateNumber?: string | null | undefined;
      faceValue: number | null | undefined;
      shareCertificateMaster: {
        companyMaster: {
          nameChangeMasters: { currentName: string | null }[];
        } | null;
      } | null;
      currentNameChangeMasters: {
        currentName: string | null;
      } | null;
    }[];
    projectID: number;
    createdAt: Date;
  };

export interface CommunicationTrackerFormType
  extends Omit<
    CommunicationTrackerType,
    "id" | "projectID" | "foliosSet" | "createdAt"
  > {}

  export type IepfTrackerType = {
    id: number;
    shareHolderDetails: string | null;
    legalHeirDetails: string | null;
    shareHolderDetailSet: ShareHolderDetailType[];
    legalHeirDetailSet: LegalHeirDetailType[];
    projectID: number;
    createdAt: Date;
  };

export interface IepfTrackerFormType
  extends Omit<
    IepfTrackerType,
    "id" | "projectID" | "shareHolderDetailSet" | "legalHeirDetailSet" | "createdAt"
  > {}

  export type PaymentTrackerType = {
  id: number;
  valuation: number;
  percentageTotal: number | null;
  noOfStages: number | null;
  percentageStage: number | null;
  noOfStagesReferral: number | null;
  percentageStageReferral: number | null;
  amountReferral: number | null;
  tdsFlag: "Yes" | "No";
  tdsPercentage: number | null;
  projectID: number;
  createdAt: Date;
};

export interface PaymentTrackerFormType
  extends Omit<PaymentTrackerType, "id" | "projectID" | "createdAt"> {}


export type PaymentTrackerStageType = {
  id: number;
  amount: number | null;
  status: "InvoiceSent" | "Paid" | "ReceiptSent" | "ToBePaid";
  date: string | null;
  paymentTrackerID: number;
  createdAt: Date;
};

export interface PaymentTrackerStageFormType
  extends Omit<PaymentTrackerStageType, "id" | "paymentTrackerID" | "createdAt"> {}

export type ReferralTrackerStageType = {
  id: number;
  amount: number | null;
  status: "InvoiceSent" | "Paid" | "ReceiptSent" | "ToBePaid";
  date: string | null;
  paymentTrackerID: number;
  createdAt: Date;
};

export interface ReferralTrackerStageFormType
  extends Omit<ReferralTrackerStageType, "id" | "paymentTrackerID" | "createdAt"> {}

export type PincodeQueryFormType = Omit<PincodeQueryType, "id" | "createdAt">;

export type StageNameQueryFormType = Omit<StageNameQueryType, "id" | "createdAt">;

export type DashboardQueryType = {
  totalProjects: number;
  totalRegistrarMasters: number;
  totalCompanyMasters: number;
  totalShares: number;
  totalValuationInNse: number;
  totalValuationInBse: number;
  totalPaid: number;
  totalValuation: number;
};

export type PaginationMainType = {
  total: number;
  current_page: number;
  per_page: number;
  first_page: number;
  last_page: number;
};

export type PaginationType<T> = T & PaginationMainType;
