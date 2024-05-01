import * as yup from "yup";

export type SchemaType = {
  registrar_name: string;
  sebi_regn_id: string;
};

export const initialValues: SchemaType = {
  registrar_name: "",
  sebi_regn_id: "",
};

export const transformValues = (values: SchemaType) => {
  return {
    registrar_name: values.registrar_name,
    sebi_regn_id: values.sebi_regn_id,
  };
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  registrar_name: yup
    .string()
    .typeError("Registrar Name must be a string")
    .required("Registrar Name is required"),
  sebi_regn_id: yup
    .string()
    .typeError("SEBI Regn. ID must be a string")
    .required("SEBI Regn. ID is required"),
});
