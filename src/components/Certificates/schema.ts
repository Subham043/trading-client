import * as yup from "yup";

export type SchemaType = {
  certificateNumber: string;
  certificateSerialNumber?: string | undefined;
};

export const initialValues: SchemaType = {
  certificateNumber: "",
  certificateSerialNumber: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  certificateNumber: yup
    .string()
    .typeError("Certificate Number must be a string")
    .required("Certificate Number is required"),
  certificateSerialNumber: yup
    .string()
    .typeError("Certificate Serial Number must be a string")
    .optional(),
});
