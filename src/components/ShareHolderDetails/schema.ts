import * as yup from "yup";

export type SchemaType = {
  shareholderName?: string | undefined | null;
  shareholderNameCertificate?: string | undefined | null;
  namePan?: string | undefined | null;
  nameAadhar?: string | undefined | null;
  nameCml?: string | undefined | null;
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
  bankAddress?: string | undefined | null;
  bankEmail?: string | undefined | null;
  bankPhone?: string | undefined | null;
  bankMICR?: string | undefined | null;
  bankIFS?: string | undefined | null;
  bankAccountNo?: string | undefined | null;
  bankAccountType?: string | undefined | null;
  addressBank?: string | undefined | null;
  emailBank?: string | undefined | null;
  phoneBank?: string | undefined | null;
  pincodeBank?: string | undefined | null;
};

export const initialValues: SchemaType = {
  shareholderName: null,
  shareholderNameCertificate: null,
  namePan: null,
  nameAadhar: null,
  nameCml: null,
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
  bankAccountType: null,
  addressBank: null,
  emailBank: null,
  phoneBank: null,
  pincodeBank: null,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  namePan: yup.string().trim().notRequired(),
  nameAadhar: yup
    .string()
    .trim()
    .oneOf([yup.ref("namePan")], "It must match with name as per pan")
    .notRequired(),
  nameCml: yup
    .string()
    .trim()
    .oneOf([yup.ref("namePan")], "It must match with name as per pan")
    .oneOf([yup.ref("nameAadhar")], "It must match with name as per aadhar")
    .notRequired(),
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
  shareholderName: yup
    .string()
    .trim()
    .notRequired(),
  shareholderNameCertificate: yup
    .string()
    .trim()
    .notRequired(),
});
