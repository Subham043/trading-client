import * as yup from "yup";

export type SchemaType = {
  newName?: string | undefined;
  previousName?: string | undefined;
  dateNameChange?: string | undefined;
  newRTA?: string | undefined;
  previousRTA?: string | undefined;
  dateRTAChange?: string | undefined;
  BSE?: string | undefined;
  NSE?: string | undefined;
  newSecuritySymbol?: string | undefined;
  oldSecuritySymbol?: string | undefined;
  dateSecurityChange?: string | undefined;
};

export const initialValues: SchemaType = {
  newName: undefined,
  previousName: undefined,
  dateNameChange: undefined,
  newRTA: undefined,
  previousRTA: undefined,
  dateRTAChange: undefined,
  BSE: undefined,
  NSE: undefined,
  newSecuritySymbol: undefined,
  oldSecuritySymbol: undefined,
  dateSecurityChange: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  BSE: yup.string().typeError("BSE must be a string").optional(),
  NSE: yup.string().typeError("NSE must be a string").optional(),
  newName: yup.string().typeError("New Name must be a string").optional(),
  previousName: yup
    .string()
    .typeError("Previous Name must be a string")
    .optional(),
  dateNameChange: yup
    .string()
    .typeError("Date of Name Change must be a string")
    .optional(),
  newRTA: yup.string().typeError("New RTA must be a string").optional(),
  previousRTA: yup
    .string()
    .typeError("Previous RTA must be a string")
    .optional(),
  dateRTAChange: yup
    .string()
    .typeError("Date of RTA Change must be a string")
    .optional(),
  newSecuritySymbol: yup
    .string()
    .typeError("New Security Symbol must be a string")
    .optional(),
  oldSecuritySymbol: yup
    .string()
    .typeError("Old Security Symbol must be a string")
    .optional(),
  dateSecurityChange: yup
    .string()
    .typeError("Date of Security Change must be a string")
    .optional(),
});
