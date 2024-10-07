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
  noOfShareHolder: string;
  noOfLegalHeir: string;
};

export const initialValues: SchemaType = {
  caseType: CaseType.Claim,
  noOfShareHolder: "0",
  noOfLegalHeir: "0",
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  caseType: yup
    .mixed<CaseType>()
    .oneOf(Object.values(CaseType), "Invalid case type")
    .required("Case Type is required"),
  noOfShareHolder: yup
    .string()
    .typeError("No. of Share Holder must be a string")
    .required("No. of Share Holder is required"),
  noOfLegalHeir: yup
    .string()
    .typeError("No. of Legal Heir must be a string")
    .required("No. of Legal Heir is required"),
});
