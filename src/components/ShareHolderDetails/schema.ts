import * as yup from "yup";

export type SchemaType = {
  shareholderName?: string | undefined | null;
  shareholderNamePan?: string | undefined | null;
  shareholderNameAadhar?: string | undefined | null;
  shareholderNameCertificate?: string | undefined | null;
  shareholderNameCml?: string | undefined | null;
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
  isDeceased?: string | undefined | null;
  shareholderNameDeath?: string | undefined | null;
  dod?: string | undefined | null;
  isTestate?: string | undefined | null;
  proofOfSucession?: string | undefined | null;
  document?: File | undefined | null;
  dateOfDocument?: string | undefined | null;
  isMinor?: string | undefined | null;
  dobMinor?: string | undefined | null;
  guardianName?: string | undefined | null;
  guardianRelationship?: string | undefined | null;
  guardianPan?: string | undefined | null;
  deceasedRelationship?: string | undefined | null;
  taxStatus?: string | undefined | null;
  selectClaimant?: string | undefined | null;
  statusClaimant?: string | undefined | null;
  percentageClaimant?: string | undefined | null;
  occupationClaimant?: string | undefined | null;
  politicalExposureClaimant?: string | undefined | null;
  annualIncomeClaimant?: string | undefined | null;
};

export const initialValues: SchemaType = {
  shareholderName: null,
  shareholderNamePan: null,
  shareholderNameAadhar: null,
  shareholderNameCertificate: null,
  shareholderNameCml: null,
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
  isDeceased: null,
  shareholderNameDeath: null,
  dod: null,
  isTestate: null,
  proofOfSucession: null,
  document: undefined,
  dateOfDocument: null,
  isMinor: null,
  dobMinor: null,
  guardianName: null,
  guardianRelationship: null,
  guardianPan: null,
  deceasedRelationship: null,
  taxStatus: null,
  selectClaimant: null,
  statusClaimant: null,
  percentageClaimant: null,
  occupationClaimant: null,
  politicalExposureClaimant: null,
  annualIncomeClaimant: null,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  shareholderName: yup.string().trim().notRequired(),
  shareholderNamePan: yup.string().trim().notRequired(),
  shareholderNameAadhar: yup.string().trim().notRequired(),
  shareholderNameCertificate: yup.string().trim().notRequired(),
  shareholderNameCml: yup.string().trim().notRequired(),
  namePan: yup.string().trim().notRequired(),
  nameAadhar: yup.string().trim().notRequired(),
  nameCml: yup.string().trim().notRequired(),
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
  isDeceased: yup.string().trim().notRequired(),
  shareholderNameDeath: yup.string().trim().notRequired(),
  dod: yup.string().trim().notRequired(),
  isTestate: yup.string().trim().notRequired(),
  proofOfSucession: yup.string().trim().notRequired(),
  document: yup
    .mixed<File>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .test("fileFormat", "Please select a valid document file", (value) => {
      if (value) {
        return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          value.type
        );
      }
      return true;
    })
    .optional(),
  dateOfDocument: yup.string().trim().notRequired(),
  isMinor: yup.string().trim().notRequired(),
  dobMinor: yup.string().trim().notRequired(),
  guardianName: yup.string().trim().notRequired(),
  guardianRelationship: yup.string().trim().notRequired(),
  guardianPan: yup.string().trim().notRequired(),
  deceasedRelationship: yup.string().trim().notRequired(),
  taxStatus: yup.string().trim().notRequired(),
  selectClaimant: yup.string().trim().notRequired(),
  statusClaimant: yup.string().trim().notRequired(),
  percentageClaimant: yup.string().trim().notRequired(),
  occupationClaimant: yup.string().trim().notRequired(),
  politicalExposureClaimant: yup.string().trim().notRequired(),
  annualIncomeClaimant: yup.string().trim().notRequired(),
});
