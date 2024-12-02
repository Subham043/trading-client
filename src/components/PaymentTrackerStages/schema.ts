import * as yup from "yup";

enum StatusType {
  InvoiceSent = "InvoiceSent",
  Paid = "Paid",
  ReceiptSent = "ReceiptSent",
  ToBePaid = "ToBePaid",
}

export type SchemaType = {
  status: "InvoiceSent" | "Paid" | "ReceiptSent" | "ToBePaid";
  date?: string | undefined;
  amount: number;
};

export const initialValues: SchemaType = {
  status: "InvoiceSent",
  date: undefined,
  amount: 0,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  status: yup
    .mixed<StatusType>()
    .oneOf(Object.values(StatusType), "Invalid status")
    .required("Status is required"),
  amount: yup
    .number()
    .typeError("amount must be a number")
    .required("amount is required"),
  date: yup
    .string()
    .typeError("Date must be a string")
    .optional(),
});
