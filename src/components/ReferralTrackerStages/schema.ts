import * as yup from "yup";

enum StatusType {
  InvoiceSent = "InvoiceSent",
  Paid = "Paid",
  ReceiptSent = "ReceiptSent",
  ToBePaid = "ToBePaid",
}

export type SchemaType = {
  status: "InvoiceSent" | "Paid" | "ReceiptSent" | "ToBePaid";
  amount: number;
};

export const initialValues: SchemaType = {
  status: "ToBePaid",
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
});
