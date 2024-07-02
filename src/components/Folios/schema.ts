import * as yup from "yup";

export type SchemaType = {
  Folio: string;
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
};

export const initialValues: SchemaType = {
  Folio: "",
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
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  Folio: yup
    .string()
    .typeError("Folio must be a string")
    .required("Folio is required"),
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
});
