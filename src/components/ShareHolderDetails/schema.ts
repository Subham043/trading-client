import * as yup from "yup";

export type SchemaType = {
  shareholderName?: string | undefined | null;
  shareholderNameCertificate?: string | undefined | null;
  namePan?: string | undefined | null;
  nameAadhar?: string | undefined | null;
  nameCml?: string | undefined | null;
  husbandName?: string | undefined | null;
  occupation?: string | undefined | null;
  phone?: string | undefined | null;
  email?: string | undefined | null;
  aadhar?: string | undefined | null;
  pan?: string | undefined | null;
  dob?: string | undefined | null;
  age?: string | undefined | null;
  nationality?: string | undefined | null;
  placeOfBirth?: string | undefined | null;
  city?: string | undefined | null;
  state?: string | undefined | null;
  countryOfBirth?: string | undefined | null;
  DPID?: string | undefined | null;
  dematAccountNo?: string | undefined | null;
  nameBank?: string | undefined | null;
  bankName?: string | undefined | null;
  branchName?: string | undefined | null;
  bankAddress?: string | undefined | null;
  bankEmail?: string | undefined | null;
  bankPhone?: string | undefined | null;
  bankMICR?: string | undefined | null;
  bankIFS?: string | undefined | null;
  bankAccountNo?: string | undefined | null;
  bankAccountType?: string | undefined | null;
  accountOpeningDate?: string | undefined | null;
  addressBank?: string | undefined | null;
  emailBank?: string | undefined | null;
  phoneBank?: string | undefined | null;
  pincodeBank?: string | undefined | null;
  addressAadhar?: string | undefined | null;
  CIN?: string | undefined | null;
  companyCIN?: string | undefined | null;
  firstName?: string | undefined | null;
  middleName?: string | undefined | null;
  lastName?: string | undefined | null;
  fatherFirstName?: string | undefined | null;
  fatherMiddleName?: string | undefined | null;
  fatherLastName?: string | undefined | null;
  password?: string | undefined | null;
  confirmPassword?: string | undefined | null;
  hintQuestion?: string | undefined | null;
  hintAnswer?: string | undefined | null;
  isCompany?: string | undefined | null;
};

export const initialValues: SchemaType = {
  shareholderName: null,
  shareholderNameCertificate: null,
  namePan: null,
  nameAadhar: null,
  nameCml: null,
  husbandName: null,
  occupation: null,
  phone: null,
  email: null,
  aadhar: null,
  pan: null,
  dob: null,
  age: null,
  nationality: null,
  placeOfBirth: null,
  city: null,
  state: null,
  countryOfBirth: null,
  DPID: null,
  dematAccountNo: null,
  nameBank: null,
  bankName: null,
  bankAddress: null,
  bankEmail: null,
  bankPhone: null,
  bankMICR: null,
  bankIFS: null,
  bankAccountNo: null,
  branchName: null,
  accountOpeningDate: null,
  bankAccountType: null,
  addressBank: null,
  emailBank: null,
  phoneBank: null,
  pincodeBank: null,
  addressAadhar: null,
  CIN: null,
  companyCIN: null,
  firstName: null,
  middleName: null,
  lastName: null,
  fatherFirstName: null,
  fatherMiddleName: null,
  fatherLastName: null,
  password: null,
  confirmPassword: null,
  hintQuestion: null,
  hintAnswer: null,
  isCompany: "No",
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  shareholderName: yup
    .string()
    .trim()
    .required("Share Holder Name is required"),
  shareholderNameCertificate: yup
    .string()
    .trim()
    .required("Share Holder Name as per certificate is required"),
  namePan: yup.string().trim().notRequired(),
  nameAadhar: yup
    .string()
    .trim()
    .notRequired(),
  nameCml: yup
    .string()
    .trim()
    .notRequired(),
  husbandName: yup.string().trim().notRequired(),
  occupation: yup.string().trim().notRequired(),
  phone: yup.string().trim().notRequired(),
  email: yup.string().trim().notRequired(),
  aadhar: yup.string().trim().notRequired(),
  pan: yup.string().trim().notRequired(),
  dob: yup.string().trim().notRequired(),
  age: yup.string().trim().notRequired(),
  nationality: yup.string().trim().notRequired(),
  placeOfBirth: yup.string().trim().notRequired(),
  city: yup.string().trim().notRequired(),
  state: yup.string().trim().notRequired(),
  countryOfBirth: yup.string().trim().notRequired(),
  DPID: yup.string().trim().notRequired(),
  dematAccountNo: yup.string().trim().notRequired(),
  nameBank: yup.string().trim().notRequired(),
  bankName: yup.string().trim().notRequired(),
  branchName: yup.string().trim().notRequired(),
  accountOpeningDate: yup.string().trim().notRequired(),
  bankAddress: yup.string().trim().notRequired(),
  bankEmail: yup.string().trim().notRequired(),
  bankPhone: yup.string().trim().notRequired(),
  bankMICR: yup.string().trim().notRequired(),
  bankIFS: yup.string().trim().notRequired(),
  bankAccountNo: yup.string().trim().notRequired(),
  bankAccountType: yup.string().trim().notRequired(),
  addressBank: yup.string().trim().notRequired(),
  emailBank: yup.string().trim().notRequired(),
  phoneBank: yup.string().trim().notRequired(),
  pincodeBank: yup.string().trim().notRequired(),
  addressAadhar: yup.string().trim().notRequired(),
  CIN: yup.string().trim().notRequired(),
  companyCIN: yup.string().trim().notRequired(),
  firstName: yup.string().trim().notRequired(),
  middleName: yup.string().trim().notRequired(),
  lastName: yup.string().trim().notRequired(),
  fatherFirstName: yup.string().trim().notRequired(),
  fatherMiddleName: yup.string().trim().notRequired(),
  fatherLastName: yup.string().trim().notRequired(),
  password: yup.string().trim().notRequired(),
  confirmPassword: yup.string().trim().notRequired(),
  hintQuestion: yup.string().trim().notRequired(),
  hintAnswer: yup.string().trim().notRequired(),
  isCompany: yup.string().trim().notRequired(),
});
