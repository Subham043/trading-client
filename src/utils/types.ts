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
