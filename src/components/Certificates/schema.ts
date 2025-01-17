import * as yup from "yup";

enum TruthyType {
  Yes = "Yes",
  No = "No",
}

enum EquityType {
  Bonus = "Bonus",
  Equity = "Equity",
  ShareBought = "ShareBought",
  Splits = "Splits",
  Rights = "Rights",
}

export type SchemaType = {
  equityType: "Equity" | "Bonus" | "ShareBought" | "Splits" | "Rights";
  certificateNumber: string;
  faceValue: number | undefined;
  shareholderName1Txt?: string | undefined;
  shareholderName2Txt?: string | undefined;
  shareholderName3Txt?: string | undefined;
  noOfShares?: string | undefined;
  noOfSharesWords?: string | undefined;
  dateOfAllotment?: string | undefined;
  dateOfAction?: string | undefined;
  distinctiveNosFrom?: string | undefined;
  distinctiveNosTo?: string | undefined;
  endorsement: "Yes" | "No";
  endorsementFolio?: string | undefined;
  endorsementDate?: string | undefined;
  endorsementShareholderName1ID?: number | undefined;
  endorsementShareholderName2ID?: number | undefined;
  endorsementShareholderName3ID?: number | undefined;
  certificateSerialNumber?: string | undefined;
};

export const initialValues: SchemaType = {
  equityType: "Equity",
  certificateNumber: "",
  certificateSerialNumber: undefined,
  faceValue: undefined,
  shareholderName1Txt: undefined,
  shareholderName2Txt: undefined,
  shareholderName3Txt: undefined,
  noOfShares: undefined,
  noOfSharesWords: undefined,
  dateOfAllotment: undefined,
  dateOfAction: undefined,
  distinctiveNosFrom: undefined,
  distinctiveNosTo: undefined,
  endorsement: "No",
  endorsementFolio: undefined,
  endorsementDate: undefined,
  endorsementShareholderName1ID: undefined,
  endorsementShareholderName2ID: undefined,
  endorsementShareholderName3ID: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  equityType: yup
    .mixed<EquityType>()
    .oneOf(Object.values(EquityType), "Invalid equity type")
    .required("Equity Type is required"),
  certificateNumber: yup
    .string()
    .typeError("Certificate Number must be a string")
    .required("Certificate Number is required"),
  certificateSerialNumber: yup
    .string()
    .typeError("Certificate Serial Number must be a string")
    .optional(),
  shareholderName1Txt: yup
    .string()
    .typeError("Share Holder Name 1 must be a string")
    .optional(),
  shareholderName2Txt: yup
    .string()
    .typeError("Share Holder Name 2 must be a string")
    .optional(),
  shareholderName3Txt: yup
    .string()
    .typeError("Share Holder Name 3 must be a string")
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
  dateOfAction: yup
    .string()
    .typeError("Date of Action must be a string")
    .optional(),
  faceValue: yup
    .number()
    .typeError("Face value value must be a number")
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
  endorsementShareholderName1ID: yup
    .number()
    .typeError("Endorsement Shareholder Name 1 must be a number")
    .optional(),
  endorsementShareholderName2ID: yup
    .number()
    .typeError("Endorsement Shareholder Name 2 must be a number")
    .optional(),
  endorsementShareholderName3ID: yup
    .number()
    .typeError("Endorsement Shareholder Name 3 must be a number")
    .optional(),
});
