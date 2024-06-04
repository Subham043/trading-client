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
  Folio?: string | undefined;
  certificateNumber?: string | undefined;
  certificateSerialNumber?: string | undefined;
  shareholderName1?: string | undefined;
  shareholderName2?: string | undefined;
  shareholderName3?: string | undefined;
  noOfShares?: string | undefined;
  noOfSharesWords?: string | undefined;
  dateOfAllotment?: string | undefined;
  faceValue: number | undefined;
  distinctiveNosFrom?: string | undefined;
  distinctiveNosTo?: string | undefined;
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
  Folio: undefined,
  certificateNumber: undefined,
  certificateSerialNumber: undefined,
  shareholderName1: undefined,
  shareholderName2: undefined,
  shareholderName3: undefined,
  noOfShares: undefined,
  noOfSharesWords: undefined,
  dateOfAllotment: undefined,
  faceValue: undefined,
  distinctiveNosFrom: undefined,
  distinctiveNosTo: undefined,
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
  Folio: yup.string().typeError("Folio must be a string").optional(),
  certificateNumber: yup
    .string()
    .typeError("Certificate Number must be a string")
    .optional(),
  certificateSerialNumber: yup
    .string()
    .typeError("Certificate Serial Number must be a string")
    .optional(),
  shareholderName1: yup
    .string()
    .typeError("Shareholder Name 1 must be a string")
    .required("Shareholder Name 1 is required"),
  shareholderName2: yup
    .string()
    .typeError("Shareholder Name 2 must be a string")
    .optional(),
  shareholderName3: yup
    .string()
    .typeError("Shareholder Name 3 must be a string")
    .optional(),
  noOfShares: yup
    .string()
    .typeError("Number Of Shares must be a string")
    .optional(),
  noOfSharesWords: yup
    .string()
    .typeError("Number Of Shares in Words must be a string")
    .optional(),
  distinctiveNosFrom: yup
    .string()
    .typeError("Distinctive Nos From must be a string")
    .optional(),
  distinctiveNosTo: yup
    .string()
    .typeError("Distinctive Nos To must be a string")
    .optional(),
  dateOfAllotment: yup
    .string()
    .typeError("Date of Allotment must be a string")
    .optional(),
  faceValue: yup
    .number()
    .typeError("Paid Up value must be a number")
    .optional(),
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
