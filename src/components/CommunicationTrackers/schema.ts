import * as yup from "yup";

export enum StageType {
  DocumentsCouriered = "DocumentsCouriered",
  DocumentsReceived = "DocumentsReceived",
}


export type SchemaType = {
  stage: "DocumentsCouriered" | "DocumentsReceived";
  folios?: string | undefined | null;
  comments?: string;
  dateSent?: string;
  dateReceived?: string;
};

export const initialValues: SchemaType = {
  stage: "DocumentsCouriered",
  comments: undefined,
  dateSent: undefined,
  dateReceived: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  stage: yup
    .mixed<StageType>()
    .oneOf(Object.values(StageType), "Invalid pending from type")
    .required("Pending From Type is required"),
  folios: yup.string().trim().notRequired(),
  comments: yup.string().typeError("Valuation must be a string").optional(),
  dateSent: yup.string().typeError("Date Sent must be a string").optional(),
  dateReceived: yup
    .string()
    .typeError("Date Received must be a string")
    .optional(),
});
