import * as yup from "yup";

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
  equityType: "Bonus" | "Shares" | "Splits" | "Rights";
  Folio: string;
  shareholderName1ID?: number | undefined;
  shareholderName2ID?: number | undefined;
  shareholderName3ID?: number | undefined;
  noOfShares?: string | undefined;
  noOfSharesWords?: string | undefined;
  dateOfAllotment?: string | undefined;
  faceValue: number | undefined;
  distinctiveNosFrom?: string | undefined;
  distinctiveNosTo?: string | undefined;
  endorsement: "Yes" | "No";
  endorsementFolio?: string | undefined;
  endorsementDate?: string | undefined;
  endorsementShareholderName1ID?: number | undefined;
  endorsementShareholderName2ID?: number | undefined;
  endorsementShareholderName3ID?: number | undefined;
};

export const initialValues: SchemaType = {
  equityType: "Bonus",
  Folio: "",
  shareholderName1ID: undefined,
  shareholderName2ID: undefined,
  shareholderName3ID: undefined,
  noOfShares: undefined,
  noOfSharesWords: undefined,
  dateOfAllotment: undefined,
  faceValue: undefined,
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
  Folio: yup
    .string()
    .typeError("Folio must be a string")
    .required("Folio is required"),
  shareholderName1ID: yup
    .number()
    .typeError("Shareholder Name 1 must be a number")
    .required("Shareholder Name 1 is required"),
  shareholderName2ID: yup
    .number()
    .typeError("Shareholder Name 2 must be a number")
    .optional(),
  shareholderName3ID: yup
    .number()
    .typeError("Shareholder Name 3 must be a number")
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
