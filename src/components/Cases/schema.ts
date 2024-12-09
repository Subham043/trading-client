import * as yup from "yup";

export enum CaseType {
  Claim = "Claim",
  ClaimIssueDuplicate = "ClaimIssueDuplicate",
  ClaimTransposition = "ClaimTransposition",
  Transmission = "Transmission",
  TransmissionIssueDuplicate = "TransmissionIssueDuplicate",
  TransmissionIssueDuplicateTransposition = "TransmissionIssueDuplicateTransposition",
  Deletion = "Deletion",
  DeletionIssueDuplicate = "DeletionIssueDuplicate",
  DeletionIssueDuplicateTransposition = "DeletionIssueDuplicateTransposition",
}

export type SchemaType = {
  caseType: CaseType;
  folios?: string | undefined | null;
  transpositionOrder?: string | undefined | null;
  isDeceased?: string | undefined | null;
  shareholderNameDeath?: string | undefined | null;
  dod?: string | undefined | null;
  placeOfDeath?: string | undefined | null;
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
  allowAffidavit?: string | undefined | null;
  selectAffidavitShareholder?: string | undefined | null;
  selectAffidavitLegalHeir?: string | undefined | null;
  statusClaimant?: string | undefined | null;
  percentageClaimant?: string | undefined | null;
  occupationClaimant?: string | undefined | null;
  politicalExposureClaimant?: string | undefined | null;
  annualIncomeClaimant?: string | undefined | null;
  deadShareholderID: number | undefined;
};

export const initialValues: SchemaType = {
  caseType: CaseType.Claim,
  isDeceased: "No",
  shareholderNameDeath: null,
  dod: null,
  placeOfDeath: null,
  isTestate: "No",
  proofOfSucession: "No",
  document: undefined,
  dateOfDocument: null,
  isMinor: "No",
  dobMinor: null,
  guardianName: null,
  guardianRelationship: null,
  guardianPan: null,
  deceasedRelationship: null,
  taxStatus: null,
  selectClaimant: null,
  allowAffidavit: "No",
  selectAffidavitShareholder: null,
  selectAffidavitLegalHeir: null,
  statusClaimant: null,
  percentageClaimant: null,
  occupationClaimant: null,
  politicalExposureClaimant: null,
  annualIncomeClaimant: null,
  deadShareholderID: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  caseType: yup
    .mixed<CaseType>()
    .oneOf(Object.values(CaseType), "Invalid case type")
    .required("Case Type is required"),
  isDeceased: yup.string().trim().notRequired(),
  folios: yup.string().trim().notRequired(),
  transpositionOrder: yup.string().trim().notRequired(),
  shareholderNameDeath: yup.string().trim().notRequired(),
  dod: yup.string().trim().notRequired(),
  placeOfDeath: yup.string().trim().notRequired(),
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
  allowAffidavit: yup.string().trim().notRequired(),
  selectAffidavitShareholder: yup.string().trim().notRequired(),
  selectAffidavitLegalHeir: yup.string().trim().notRequired(),
  statusClaimant: yup.string().trim().notRequired(),
  percentageClaimant: yup.string().trim().notRequired(),
  occupationClaimant: yup.string().trim().notRequired(),
  politicalExposureClaimant: yup.string().trim().notRequired(),
  annualIncomeClaimant: yup.string().trim().notRequired(),
  deadShareholderID: yup
    .number()
    .typeError("Dead Shareholder must be a number")
    .optional(),
});
