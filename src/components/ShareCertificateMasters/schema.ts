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

enum EquityType {
  Bonus = "Bonus",
  Shares = "Shares",
  Splits = "Splits",
  Rights = "Rights",
}

enum TruthyType {
  Yes = "Yes",
  No = "No",
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
  equityType: "Bonus" | "Shares" | "Splits" | "Rights";
  endorsement: "Yes" | "No";
  endorsementFolio?: string | undefined;
  endorsementDate?: string | undefined;
  endorsementShareholderName1?: string | undefined;
  endorsementShareholderName2?: string | undefined;
  endorsementShareholderName3?: string | undefined;
  companyID?: number | undefined;
};

export const initialValues: SchemaType = {
  instrumentType: "InvIT",
  equityType: "Bonus",
  endorsement: "No",
  endorsementFolio: undefined,
  endorsementDate: undefined,
  endorsementShareholderName1: undefined,
  endorsementShareholderName2: undefined,
  endorsementShareholderName3: undefined,
  companyID: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  instrumentType: yup
    .mixed<InstrumentType>()
    .oneOf(Object.values(InstrumentType), "Invalid instrument type")
    .required("Instrument Type is required"),
  equityType: yup
    .mixed<EquityType>()
    .oneOf(Object.values(EquityType), "Invalid equity type")
    .required("Equity Type is required"),
  endorsement: yup
    .mixed<TruthyType>()
    .oneOf(Object.values(TruthyType), "Invalid Endorsement")
    .required("Endorsement is required"),
  endorsementFolio: yup
    .string()
    .typeError("Endorsement Folio must be a string")
    .optional(),
  endorsementDate: yup
    .string()
    .typeError("Endorsement Date must be a string")
    .optional(),
  endorsementShareholderName1: yup
    .string()
    .typeError("Endorsement Shareholder Name 1 must be a string")
    .optional(),
  endorsementShareholderName2: yup
    .string()
    .typeError("Endorsement Shareholder Name 2 must be a string")
    .optional(),
  endorsementShareholderName3: yup
    .string()
    .typeError("Endorsement Shareholder Name 3 must be a string")
    .optional(),
  companyID: yup
    .number()
    .typeError("Company Master ID must be a number")
    .required("Company Master ID is required"),
});
