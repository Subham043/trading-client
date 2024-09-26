import * as yup from "yup";

export enum CaseType {
  ClaimSuspense = "ClaimSuspense",
  ClaimSuspenseTransmission = "ClaimSuspenseTransmission",
  ClaimSuspenseTransmissionIssueDuplicate = "ClaimSuspenseTransmissionIssueDuplicate",
  ClaimSuspenseTransmissionIssueDuplicateTransposition = "ClaimSuspenseTransmissionIssueDuplicateTransposition",
  Transmission = "Transmission",
  TransmissionIssueDuplicate = "TransmissionIssueDuplicate",
  TransmissionIssueDuplicateTransposition = "TransmissionIssueDuplicateTransposition",
}

export type SchemaType = {
  caseType:
    | "ClaimSuspense"
    | "ClaimSuspenseTransmission"
    | "ClaimSuspenseTransmissionIssueDuplicate"
    | "ClaimSuspenseTransmissionIssueDuplicateTransposition"
    | "Transmission"
    | "TransmissionIssueDuplicate"
    | "TransmissionIssueDuplicateTransposition";
  noOfLegalHeir: string;
};

export const initialValues: SchemaType = {
  caseType: "ClaimSuspense",
  noOfLegalHeir: "",
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  caseType: yup
    .mixed<CaseType>()
    .oneOf(Object.values(CaseType), "Invalid case type")
    .required("Case Type is required"),
  noOfLegalHeir: yup
    .string()
    .typeError("No. of Legal Heir must be a string")
    .required("No. of Legal Heir is required"),
});
