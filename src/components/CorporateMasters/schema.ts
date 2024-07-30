import * as yup from "yup";

enum CorporateActionType {
  Equity = "Equity",
  Bonus = "Bonus",
  Splits = "Splits",
  Rights = "Rights",
  ShareBought = "ShareBought",
}

export type SchemaType = {
  date: string;
  type: "Equity" | "Bonus" | "Shares" | "Splits" | "Rights" | "ShareBought";
  numerator: number;
  denominator: number;
};

export const initialValues: SchemaType = {
  date: "",
  type: "Equity",
  numerator: 0,
  denominator: 0,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  type: yup
    .mixed<CorporateActionType>()
    .oneOf(Object.values(CorporateActionType), "Invalid type")
    .required("Type is required"),
  date: yup
    .string()
    .typeError("Date must be a string")
    .required("Date is required"),
  numerator: yup
    .number()
    .typeError("Numerator must be a number")
    .required("Numerator is required"),
  denominator: yup
    .number()
    .typeError("Denominator must be a number")
    .required("Denominator is required"),
});

export const transformValues = (values: SchemaType) => {
  return {
    date: values.date,
    type: values.type,
    numerator: Number(values.numerator),
    denominator: Number(values.denominator),
  };
};
