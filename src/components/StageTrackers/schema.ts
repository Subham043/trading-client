import * as yup from "yup";

export enum PendingFromType {
  Client = "Client",
  RTA = "RTA",
  IEPF = "IEPF",
  ServiceProvider = "ServiceProvider",
}


export type SchemaType = {
  pendingFrom: "Client" | "RTA" | "IEPF" | "ServiceProvider";
  stage: string;
  comments?: string;
  date?: string;
};

export const initialValues: SchemaType = {
  pendingFrom: "Client",
  stage: "",
  comments: undefined,
  date: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  pendingFrom: yup
    .mixed<PendingFromType>()
    .oneOf(Object.values(PendingFromType), "Invalid pending from type")
    .required("Pending From Type is required"),
  stage: yup
    .string()
    .typeError("Valuation must be a string")
    .required("Valuation is required"),
  comments: yup.string().typeError("Valuation must be a string").optional(),
  date: yup.string().typeError("Date must be a string").optional(),
});
