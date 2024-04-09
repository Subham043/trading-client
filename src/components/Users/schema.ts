import * as yup from "yup";

type UpdateSchema = {
  email: string;
  name: string;
};
type CreateSchema = UpdateSchema & {
  password: string;
  confirm_password: string;
};
export type SchemaType = CreateSchema;

export const updateSchema: yup.ObjectSchema<UpdateSchema> = yup.object().shape({
  email: yup.string().required("Email is required").email("Invalid email"),
  name: yup.string().required("Name is required"),
});

export const createSchema: yup.ObjectSchema<SchemaType> = updateSchema.shape({
  password: yup.string().required("Password is required"),
  confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
