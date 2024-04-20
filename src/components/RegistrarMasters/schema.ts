import * as yup from "yup";

export type SchemaType = {
  registrar_name: string;
  sebi_regn_id: string;
  address?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  pincode?: number | undefined;
  telephone1?: string | undefined;
  telephone2?: string | undefined;
  email?: string | undefined;
  website?: string | undefined;
  nameContactPerson?: string | undefined;
  designationContactPerson?: string | undefined;
  emailContactPerson?: string | undefined;
  phoneContactPerson?: string | undefined;
  officerAssigned?: string | undefined;
  branch?: string | undefined;
  companyId?: number | undefined;
};

export const initialValues: SchemaType = {
  registrar_name: "",
  sebi_regn_id: "",
  address: undefined,
  city: undefined,
  state: undefined,
  pincode: undefined,
  telephone1: undefined,
  telephone2: undefined,
  email: undefined,
  website: undefined,
  nameContactPerson: undefined,
  designationContactPerson: undefined,
  emailContactPerson: undefined,
  phoneContactPerson: undefined,
  officerAssigned: undefined,
  branch: undefined,
  companyId: undefined,
};

export const transformValues = (values: SchemaType) => {
  return {
    registrar_name: values.registrar_name,
    sebi_regn_id: values.sebi_regn_id,
    address:
      values.address && values.address.length > 0 ? values.address : undefined,
    city: values.city && values.city.length > 0 ? values.city : undefined,
    state: values.state && values.state.length > 0 ? values.state : undefined,
    pincode: values.pincode ? Number(values.pincode) : undefined,
    telephone1:
      values.telephone1 && values.telephone1.length > 0
        ? values.telephone1
        : undefined,
    telephone2:
      values.telephone2 && values.telephone2.length > 0
        ? values.telephone2
        : undefined,
    email: values.email && values.email.length > 0 ? values.email : undefined,
    website:
      values.website && values.website.length > 0 ? values.website : undefined,
    nameContactPerson:
      values.nameContactPerson && values.nameContactPerson.length > 0
        ? values.nameContactPerson
        : undefined,
    designationContactPerson:
      values.designationContactPerson &&
      values.designationContactPerson.length > 0
        ? values.designationContactPerson
        : undefined,
    emailContactPerson:
      values.emailContactPerson && values.emailContactPerson.length > 0
        ? values.emailContactPerson
        : undefined,
    phoneContactPerson:
      values.phoneContactPerson && values.phoneContactPerson.length > 0
        ? values.phoneContactPerson
        : undefined,
    officerAssigned:
      values.officerAssigned && values.officerAssigned.length > 0
        ? values.officerAssigned
        : undefined,
    branch:
      values.branch && values.branch.length > 0 ? values.branch : undefined,
    companyId:
      values.companyId && values.companyId > 0 ? values.companyId : undefined,
  };
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  email: yup
    .string()
    .typeError("Email must be a string")
    .email("Invalid email")
    .optional(),
  website: yup
    .string()
    .typeError("Website must be a string")
    .url("Invalid url")
    .optional(),
  nameContactPerson: yup
    .string()
    .typeError("Name of Contact Person must be a string")
    .optional(),
  designationContactPerson: yup
    .string()
    .typeError("Designation of Contact Person must be a string")
    .optional(),
  emailContactPerson: yup
    .string()
    .typeError("Email of Contact Person must be a string")
    .email("Invalid email")
    .optional(),
  phoneContactPerson: yup
    .string()
    .typeError("Phone of Contact Person must be a string")
    .optional(),
  telephone1: yup.string().typeError("Telephone 1 must be a string").optional(),
  telephone2: yup.string().typeError("Telephone 2 must be a string").optional(),
  pincode: yup.number().typeError("Pincode must be a number").optional(),
  state: yup.string().typeError("State must be a string").optional(),
  city: yup.string().typeError("City must be a string").optional(),
  address: yup.string().typeError("Address must be a string").optional(),
  registrar_name: yup
    .string()
    .typeError("Registrar Name must be a string")
    .required("Registrar Name is required"),
  sebi_regn_id: yup
    .string()
    .typeError("SEBI Regn. ID must be a string")
    .required("SEBI Regn. ID is required"),
  officerAssigned: yup
    .string()
    .typeError("Officer Assigned must be a string")
    .optional(),
  branch: yup.string().typeError("Branch must be a string").optional(),
  companyId: yup
    .number()
    .typeError("Company Id must be a number")
    .required("Company Id is required"),
});
