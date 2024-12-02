import * as yup from "yup";

export type SchemaType = {
  name: string;
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  name: yup.string().required("Name is required"),
});
