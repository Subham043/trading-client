import * as yup from "yup";

export type SchemaType = {
  email: string;
  name: string;
  password: string;
  confirm_password: string;
};

export const updateSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Invalid email"),
  name: yup.string().required("Name is required"),
});

export const createSchema = updateSchema.shape({
  password: yup.string().required("Password is required"),
  confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
