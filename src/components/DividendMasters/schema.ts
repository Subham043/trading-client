import * as yup from "yup";

export type SchemaType = {
  recorded_date: number;
  financial_year?: number;
  dividend_per_share: number;
};

export const initialValues: SchemaType = {
  recorded_date: 0,
  financial_year: undefined,
  dividend_per_share: 0,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  recorded_date: yup
    .number()
    .typeError("Recorded Date in Year must be a number")
    .required("Recorded Date is required"),
  financial_year: yup
    .number()
    .typeError("Financial year must be a number")
    .optional(),
  dividend_per_share: yup
    .number()
    .typeError("Dividend Per Share must be a number")
    .required("Dividend Per Share is required"),
});

export const transformValues = (values: SchemaType) => {
  return {
    recorded_date: Number(values.recorded_date),
    financial_year: Number(values.financial_year),
    dividend_per_share: Number(values.dividend_per_share),
  };
};
