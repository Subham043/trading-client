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
  currentName?: string | undefined;
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
  registrarMasterBranchId?: number | undefined;
};

export const initialValues: SchemaType = {
  ISIN: "",
  CIN: undefined,
  currentName: undefined,
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
  registrarMasterBranchId: undefined,
};

export const transformValues = (values: SchemaType) => {
  return {
    ISIN: values.ISIN,
    closingPriceBSE: Number(values.closingPriceBSE),
    closingPriceNSE: Number(values.closingPriceNSE),
    faceValue: Number(values.faceValue),
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
    CIN: values.CIN && values.CIN.length > 0 ? values.CIN : undefined,
    currentName:
      values.currentName && values.currentName.length > 0
        ? values.currentName
        : undefined,
    BSE: values.BSE && values.BSE.length > 0 ? values.BSE : undefined,
    NSE: values.NSE && values.NSE.length > 0 ? values.NSE : undefined,
    city: values.city && values.city.length > 0 ? values.city : undefined,
    state: values.state && values.state.length > 0 ? values.state : undefined,
    registeredOffice:
      values.registeredOffice && values.registeredOffice.length > 0
        ? values.registeredOffice
        : undefined,
    pincode: values.pincode ? Number(values.pincode) : undefined,
    registrarMasterBranchId: values.registrarMasterBranchId
      ? Number(values.registrarMasterBranchId)
      : undefined,
    telephone:
      values.telephone && values.telephone.length > 0
        ? values.telephone
        : undefined,
    fax: values.fax && values.fax.length > 0 ? values.fax : undefined,
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
  fax: yup.string().typeError("Fax must be a string").optional(),
  telephone: yup.string().typeError("Telephone must be a string").optional(),
  pincode: yup.number().typeError("Pincode must be a number").optional(),
  registrarMasterBranchId: yup
    .number()
    .typeError("Registrar Master Branch ID must be a number")
    .optional(),
  state: yup.string().typeError("State must be a string").optional(),
  city: yup.string().typeError("City must be a string").optional(),
  registeredOffice: yup
    .string()
    .typeError("Registered Office must be a string")
    .optional(),
  CIN: yup.string().typeError("CIN must be a string").optional(),
  BSE: yup.string().typeError("BSE must be a string").optional(),
  NSE: yup.string().typeError("NSE must be a string").optional(),
  currentName: yup
    .string()
    .typeError("Current Name must be a string")
    .required("Current Name is required"),
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
