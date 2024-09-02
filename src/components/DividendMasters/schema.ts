import * as yup from "yup";

export type SchemaType = {
  recorded_date: string;
  financial_year?: string;
  dividend_per_share: number;
};

export const initialValues: SchemaType = {
  recorded_date: "",
  financial_year: undefined,
  dividend_per_share: 0,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  recorded_date: yup
    .string()
    .typeError("Recorded Date must be a string")
    .required("Recorded Date is required"),
  financial_year: yup
    .string()
    .typeError("Financial year must be a string")
    .optional(),
  dividend_per_share: yup
    .number()
    .typeError("Dividend Per Share must be a number")
    .required("Dividend Per Share is required"),
});

export const transformValues = (values: SchemaType) => {
  return {
    recorded_date: values.recorded_date,
    financial_year: values.financial_year,
    dividend_per_share: Number(values.dividend_per_share),
  };
};
