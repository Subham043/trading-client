import * as yup from "yup";

export type SchemaType = {
  currentName?: string | undefined;
  previousName?: string | undefined;
  dateNameChange?: string | undefined;
  BSE?: string | undefined;
  NSE?: string | undefined;
};

export const initialValues: SchemaType = {
  currentName: undefined,
  previousName: undefined,
  dateNameChange: undefined,
  BSE: undefined,
  NSE: undefined,
};

export const transformValues = (values: SchemaType) => {
  return {
    BSE: values.BSE && values.BSE.length > 0 ? values.BSE : undefined,
    NSE: values.NSE && values.NSE.length > 0 ? values.NSE : undefined,
    currentName:
      values.currentName && values.currentName.length > 0
        ? values.currentName
        : undefined,
    previousName:
      values.previousName && values.previousName.length > 0
        ? values.previousName
        : undefined,
    dateNameChange:
      values.dateNameChange && values.dateNameChange.length > 0
        ? values.dateNameChange
        : undefined,
  };
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  BSE: yup.string().typeError("BSE must be a string").optional(),
  NSE: yup.string().typeError("NSE must be a string").optional(),
  currentName: yup
    .string()
    .typeError("New Name must be a string")
    .required("New Name is required"),
  previousName: yup
    .string()
    .typeError("Previous Name must be a string")
    .required("Previous Name is required"),
  dateNameChange: yup
    .string()
    .typeError("Date of Name Change must be a string")
    .optional(),
});
