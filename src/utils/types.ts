import { AxiosResponse } from "axios";
import { ReactNode } from "react";

export type ChildrenType = {
  children: ReactNode;
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

export type PaginationType<T> = T & {
  total: number;
  current_page: number;
  per_page: number;
  first_page: number;
  last_page: number;
};
