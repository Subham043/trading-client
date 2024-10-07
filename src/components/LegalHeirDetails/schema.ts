import * as yup from "yup";

export type SchemaType = {
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
