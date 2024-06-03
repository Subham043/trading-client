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
  Symbol?: string | undefined;
  Series?: string | undefined;
  securityName?: string | undefined;
  dateOfListing?: string | undefined;
  dateOfAllotment?: string | undefined;
  redemptionDate?: string | undefined;
  conversionDate?: string | undefined;
  paidUpValue: number | undefined;
  faceValue: number | undefined;
  dividend: number | undefined;
  redemptionAmount: number | undefined;
  conversionAmount: number | undefined;
  marketLot?: string | undefined;
  isinNumber?: string | undefined;
  distinctiveNosFrom?: string | undefined;
  distinctiveNosTo?: string | undefined;
  companyID?: number | undefined;
};

export const initialValues: SchemaType = {
  instrumentType: "InvIT",
  Symbol: undefined,
  Series: undefined,
  securityName: undefined,
  dateOfListing: undefined,
  dateOfAllotment: undefined,
  redemptionDate: undefined,
  conversionDate: undefined,
  paidUpValue: undefined,
  faceValue: undefined,
  dividend: undefined,
  redemptionAmount: undefined,
  conversionAmount: undefined,
  marketLot: undefined,
  isinNumber: undefined,
  distinctiveNosFrom: undefined,
  distinctiveNosTo: undefined,
  companyID: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  instrumentType: yup
    .mixed<InstrumentType>()
    .oneOf(Object.values(InstrumentType), "Invalid instrument type")
    .required("Instrument Type is required"),
  Symbol: yup.string().typeError("Symbol must be a string").optional(),
  Series: yup.string().typeError("Series must be a string").optional(),
  securityName: yup
    .string()
    .typeError("Security Name must be a string")
    .optional(),
  marketLot: yup.string().typeError("Market Lot must be a string").optional(),
  isinNumber: yup.string().typeError("ISIN Number must be a string").optional(),
  distinctiveNosFrom: yup
    .string()
    .typeError("Distinctive Nos From must be a string")
    .optional(),
  distinctiveNosTo: yup
    .string()
    .typeError("Distinctive Nos To must be a string")
    .optional(),
  dateOfListing: yup
    .string()
    .typeError("Date of Listing must be a string")
    .optional(),
  dateOfAllotment: yup
    .string()
    .typeError("Date of Allotment must be a string")
    .optional(),
  redemptionDate: yup
    .string()
    .typeError("Redemption Date must be a string")
    .optional(),
  conversionDate: yup
    .string()
    .typeError("Conversion Date must be a string")
    .optional(),
  paidUpValue: yup
    .number()
    .typeError("Paid Up value must be a number")
    .optional(),
  faceValue: yup
    .number()
    .typeError("Paid Up value must be a number")
    .optional(),
  dividend: yup.number().typeError("Dividend must be a number").optional(),
  redemptionAmount: yup
    .number()
    .typeError("Redemption Amount must be a number")
    .optional(),
  conversionAmount: yup
    .number()
    .typeError("Conversion Amount must be a number")
    .optional(),
  companyID: yup
    .number()
    .typeError("Company Master ID must be a number")
    .required("Company Master ID is required"),
});
