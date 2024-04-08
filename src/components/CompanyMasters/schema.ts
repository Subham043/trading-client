import * as yup from "yup";

export type SchemaType = {
  email?: string | undefined;
  website?: string | undefined;
  nameContactPerson?: string | undefined;
  designationContactPerson?: string | undefined;
  emailContactPerson?: string | undefined;
  phoneContactPerson?: string | undefined;
  fax?: string | undefined;
  telephone?: string | undefined;
  newName?: string | undefined;
  BSE?: string | undefined;
  NSE?: string | undefined;
  CIN?: string | undefined;
  ISIN: string;
  faceValue: number;
  closingPriceNSE: number;
  closingPriceBSE: number;
  registeredOffice?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  pincode?: number | undefined;
};

export const initialValues: SchemaType = {
  ISIN: "",
  CIN: undefined,
  newName: undefined,
  BSE: undefined,
  NSE: undefined,
  faceValue: 0.0,
  closingPriceNSE: 0.0,
  closingPriceBSE: 0.0,
  registeredOffice: undefined,
  city: undefined,
  state: undefined,
  pincode: undefined,
  telephone: undefined,
  fax: undefined,
  email: undefined,
  website: undefined,
  nameContactPerson: undefined,
  designationContactPerson: undefined,
  emailContactPerson: undefined,
  phoneContactPerson: undefined,
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
  fax: yup.string().typeError("Fax must be a string").optional(),
  telephone: yup.string().typeError("Telephone must be a string").optional(),
  pincode: yup.number().typeError("Pincode must be a number").optional(),
  state: yup.string().typeError("State must be a string").optional(),
  city: yup.string().typeError("City must be a string").optional(),
  registeredOffice: yup
    .string()
    .typeError("Registered Office must be a string")
    .optional(),
  CIN: yup.string().typeError("CIN must be a string").optional(),
  BSE: yup.string().typeError("BSE must be a string").optional(),
  NSE: yup.string().typeError("NSE must be a string").optional(),
  newName: yup
    .string()
    .typeError("Name must be a string")
    .required("Name is required"),
  ISIN: yup
    .string()
    .typeError("ISIN must be a string")
    .required("ISIN is required"),
  faceValue: yup
    .number()
    .typeError("Face value must be a number")
    .required("Face value is required"),
  closingPriceNSE: yup
    .number()
    .typeError("Closing Price in NSE must be a number")
    .required("Closing Price in NSE is required"),
  closingPriceBSE: yup
    .number()
    .typeError("Closing Price in BSE must be a number")
    .required("Closing Price in BSE is required"),
});
