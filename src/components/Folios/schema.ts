import * as yup from "yup";

export type SchemaType = {
  Folio: string;
  shareholderName1ID?: number | undefined;
  shareholderName2ID?: number | undefined;
  shareholderName3ID?: number | undefined;
};

export const initialValues: SchemaType = {
  Folio: "",
  shareholderName1ID: undefined,
  shareholderName2ID: undefined,
  shareholderName3ID: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
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
});
