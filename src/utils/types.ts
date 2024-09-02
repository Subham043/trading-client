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
  endorsement: "Yes" | "No";
  endorsementFolio?: string | null;
  endorsementDate?: Date | null;
  endorsementShareholderName1?: string | null;
  endorsementShareholderName2?: string | null;
  endorsementShareholderName3?: string | null;
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
  shareholderName1?: string | null;
  shareholderName2?: string | null;
  shareholderName3?: string | null;
  noOfShares?: string | null;
  noOfSharesWords?: string | null;
  dateOfAllotment?: Date | null;
  faceValue: number | null;
  distinctiveNosFrom?: string | null;
  distinctiveNosTo?: string | null;
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

export type PincodeQueryFormType = Omit<PincodeQueryType, "id" | "createdAt">;

export type PaginationMainType = {
  total: number;
  current_page: number;
  per_page: number;
  first_page: number;
  last_page: number;
};

export type PaginationType<T> = T & PaginationMainType;
