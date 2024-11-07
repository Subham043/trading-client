import * as yup from "yup";

enum InstrumentType {
  InvIT = "InvIT",
  IDR = "IDR",
  MFs = "MFs",
  PreferenceShares = "PreferenceShares",
  REiT = "REiT",
  Equity = "Equity",
  Warrant = "Warrant",
}


export type SchemaType = {
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
  companyID?: number | undefined;
};

export const initialValues: SchemaType = {
  instrumentType: "InvIT",
  companyID: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  instrumentType: yup
    .mixed<InstrumentType>()
    .oneOf(Object.values(InstrumentType), "Invalid instrument type")
    .required("Instrument Type is required"),
  companyID: yup
    .number()
    .typeError("Company Master ID must be a number")
    .required("Company Master ID is required"),
});
