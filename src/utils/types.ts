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

export type CompanyMasterType = {
  id: number;
  newName?: string | undefined;
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
};

export type CompanyMasterFormType = Omit<CompanyMasterType, "id" | "createdAt">;

export type NameChangeMasterType = {
  id: number;
  // newName?: string | undefined;
  currentName?: string | undefined;
  previousName?: string | undefined;
  dateNameChange?: string | undefined;
  // newRTA?: string | undefined;
  // previousRTA?: string | undefined;
  // dateRTAChange?: string | undefined;
  BSE?: string | undefined;
  NSE?: string | undefined;
  // oldSecuritySymbol?: string | undefined;
  // newSecuritySymbol?: string | undefined;
  // dateSecurityChange?: string | undefined;
  companyId: number;
  createdAt: string;
};

export type NameChangeMasterFormType = Omit<
  NameChangeMasterType,
  "id" | "createdAt" | "companyId"
>;

export type RegistrarMasterType = {
  id: number;
  newName?: string;
  currentName?: string;
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
  branch?: string | undefined;
  createdAt?: Date;
  companyId?: number | undefined;
};

export interface RegistrarMasterFormType
  extends Omit<
    RegistrarMasterType,
    "id" | "createdAt" | "newName" | "currentName" | "pincode"
  > {
  pincode?: number | undefined;
}

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
