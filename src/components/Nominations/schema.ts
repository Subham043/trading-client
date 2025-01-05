import * as yup from "yup";


export type SchemaType = {
  companyName: string;
  fullName: string;
  age?: string | null | undefined;
  address?: string | null | undefined;
  isEmployed: string;
  employerName?: string | null | undefined;
  salary?: string | null | undefined;
  employerAddress?: string | null | undefined;
  isBusiness: string;
  businessName?: string | null | undefined;
  businessNature?: string | null | undefined;
  businessIncome?: string | null | undefined;
  businessProfit?: string | null | undefined;
  businessAddress?: string | null | undefined;
  isProperty: string;
  propertyType?: string | null | undefined;
  propertySituation?: string | null | undefined;
  propertyValue?: string | null | undefined;
  propertyRent?: string | null | undefined;
};

export const initialValues: SchemaType = {
  isEmployed: "No",
  isBusiness: "No",
  isProperty: "No",
  companyName: "",
  fullName: "",
  age: undefined,
  address: undefined,
  employerName: undefined,
  salary: undefined,
  employerAddress: undefined,
  businessName: undefined,
  businessNature: undefined,
  businessIncome: undefined,
  businessProfit: undefined,
  businessAddress: undefined,
  propertyType: "House",
  propertySituation: undefined,
  propertyValue: undefined,
  propertyRent: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  companyName: yup.string().trim().required(),
  fullName: yup.string().trim().required(),
  isEmployed: yup.string().trim().required(),
  isBusiness: yup.string().trim().required(),
  isProperty: yup.string().trim().required(),
  age: yup.string().trim().notRequired(),
  address: yup.string().trim().notRequired(),
  employerName: yup.string().trim().notRequired(),
  salary: yup.string().trim().notRequired(),
  employerAddress: yup.string().trim().notRequired(),
  businessName: yup.string().trim().notRequired(),
  businessNature: yup.string().trim().notRequired(),
  businessIncome: yup.string().trim().notRequired(),
  businessProfit: yup.string().trim().notRequired(),
  businessAddress: yup.string().trim().notRequired(),
  propertyType: yup.string().trim().notRequired(),
  propertySituation: yup.string().trim().notRequired(),
  propertyValue: yup.string().trim().notRequired(),
  propertyRent: yup.string().trim().notRequired(),
});
