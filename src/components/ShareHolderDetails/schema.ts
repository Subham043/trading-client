import * as yup from "yup";

export type SchemaType = {
  shareholderName?: string | undefined;
  shareholderNamePan?: string | undefined;
  shareholderNameAadhar?: string | undefined;
  shareholderNameAadharCertificate?: string | undefined;
  shareholderNameAadharCml?: string | undefined;
  namePan?: string | undefined;
  nameAadhar?: string | undefined;
  nameCml?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  aadhar?: string | undefined;
  pan?: string | undefined;
  dob?: string | undefined;
  age?: string | undefined;
  nationality?: string | undefined;
  placeOfBirth?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  countryOfBirth?: string | undefined;
  DPID?: string | undefined;
  dematAccountNo?: string | undefined;
  nameBank?: string | undefined;
  bankAddress?: string | undefined;
  bankEmail?: string | undefined;
  bankPhone?: string | undefined;
  bankMICR?: string | undefined;
  bankIFS?: string | undefined;
  bankAccountNo?: string | undefined;
  bankAccountType?: string | undefined;
  addressBank?: string | undefined;
  emailBank?: string | undefined;
  phoneBank?: string | undefined;
  pincodeBank?: string | undefined;
  isDeceased?: string | undefined;
  shareholderNameDeath?: string | undefined;
  dod?: string | undefined;
  isTestate?: string | undefined;
  proofOfSucession?: string | undefined;
  document?: string | undefined;
  dateOfDocument?: string | undefined;
  isMinor?: string | undefined;
  dobMinor?: string | undefined;
  guardianName?: string | undefined;
  guardianRelationship?: string | undefined;
  guardianPan?: string | undefined;
  deceasedRelationship?: string | undefined;
  taxStatus?: string | undefined;
  selectClaimant?: string | undefined;
  statusClaimant?: string | undefined;
  percentageClaimant?: string | undefined;
  occupationClaimant?: string | undefined;
  politicalExposureClaimant?: string | undefined;
  annualIncomeClaimant?: string | undefined;
};

export const initialValues: SchemaType = {
  shareholderName: undefined,
  shareholderNamePan: undefined,
  shareholderNameAadhar: undefined,
  shareholderNameAadharCertificate: undefined,
  shareholderNameAadharCml: undefined,
  namePan: undefined,
  nameAadhar: undefined,
  nameCml: undefined,
  phone: undefined,
  email: undefined,
  aadhar: undefined,
  pan: undefined,
  dob: undefined,
  age: undefined,
  nationality: undefined,
  placeOfBirth: undefined,
  city: undefined,
  state: undefined,
  countryOfBirth: undefined,
  DPID: undefined,
  dematAccountNo: undefined,
  nameBank: undefined,
  bankAddress: undefined,
  bankEmail: undefined,
  bankPhone: undefined,
  bankMICR: undefined,
  bankIFS: undefined,
  bankAccountNo: undefined,
  bankAccountType: undefined,
  addressBank: undefined,
  emailBank: undefined,
  phoneBank: undefined,
  pincodeBank: undefined,
  isDeceased: undefined,
  shareholderNameDeath: undefined,
  dod: undefined,
  isTestate: undefined,
  proofOfSucession: undefined,
  document: undefined,
  dateOfDocument: undefined,
  isMinor: undefined,
  dobMinor: undefined,
  guardianName: undefined,
  guardianRelationship: undefined,
  guardianPan: undefined,
  deceasedRelationship: undefined,
  taxStatus: undefined,
  selectClaimant: undefined,
  statusClaimant: undefined,
  percentageClaimant: undefined,
  occupationClaimant: undefined,
  politicalExposureClaimant: undefined,
  annualIncomeClaimant: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  shareholderName: yup.string().trim().optional(),
  shareholderNamePan: yup.string().trim().optional(),
  shareholderNameAadhar: yup.string().trim().optional(),
  shareholderNameAadharCertificate: yup.string().trim().optional(),
  shareholderNameAadharCml: yup.string().trim().optional(),
  namePan: yup.string().trim().optional(),
  nameAadhar: yup.string().trim().optional(),
  nameCml: yup.string().trim().optional(),
  phone: yup.string().trim().optional(),
  email: yup.string().trim().optional(),
  aadhar: yup.string().trim().optional(),
  pan: yup.string().trim().optional(),
  dob: yup.string().trim().optional(),
  age: yup.string().trim().optional(),
  nationality: yup.string().trim().optional(),
  placeOfBirth: yup.string().trim().optional(),
  city: yup.string().trim().optional(),
  state: yup.string().trim().optional(),
  countryOfBirth: yup.string().trim().optional(),
  DPID: yup.string().trim().optional(),
  dematAccountNo: yup.string().trim().optional(),
  nameBank: yup.string().trim().optional(),
  bankAddress: yup.string().trim().optional(),
  bankEmail: yup.string().trim().optional(),
  bankPhone: yup.string().trim().optional(),
  bankMICR: yup.string().trim().optional(),
  bankIFS: yup.string().trim().optional(),
  bankAccountNo: yup.string().trim().optional(),
  bankAccountType: yup.string().trim().optional(),
  addressBank: yup.string().trim().optional(),
  emailBank: yup.string().trim().optional(),
  phoneBank: yup.string().trim().optional(),
  pincodeBank: yup.string().trim().optional(),
  isDeceased: yup.string().trim().optional(),
  shareholderNameDeath: yup.string().trim().optional(),
  dod: yup.string().trim().optional(),
  isTestate: yup.string().trim().optional(),
  proofOfSucession: yup.string().trim().optional(),
  document: yup.string().trim().optional(),
  dateOfDocument: yup.string().trim().optional(),
  isMinor: yup.string().trim().optional(),
  dobMinor: yup.string().trim().optional(),
  guardianName: yup.string().trim().optional(),
  guardianRelationship: yup.string().trim().optional(),
  guardianPan: yup.string().trim().optional(),
  deceasedRelationship: yup.string().trim().optional(),
  taxStatus: yup.string().trim().optional(),
  selectClaimant: yup.string().trim().optional(),
  statusClaimant: yup.string().trim().optional(),
  percentageClaimant: yup.string().trim().optional(),
  occupationClaimant: yup.string().trim().optional(),
  politicalExposureClaimant: yup.string().trim().optional(),
  annualIncomeClaimant: yup.string().trim().optional(),
});
