import * as yup from "yup";

export type SchemaType = {
  name: string;
};

export const initialValues: SchemaType = {
  name: "",
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  name: yup
    .string()
    .typeError("Name must be a string")
    .required("Name is required"),
});
