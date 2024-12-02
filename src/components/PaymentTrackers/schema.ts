import * as yup from "yup";

enum TruthyType {
  Yes = "Yes",
  No = "No",
}


export type SchemaType = {
  tdsFlag: "Yes" | "No";
  valuation: number;
  percentageTotal: number;
  noOfStages: number;
  percentageStage: number;
  noOfStagesReferral: number;
  percentageStageReferral: number;
  tdsPercentage: number;
  amountReferral: number;
};

export const initialValues: SchemaType = {
  tdsFlag: "No",
  valuation: 0,
  percentageTotal: 0,
  noOfStages: 0,
  percentageStage: 0,
  noOfStagesReferral: 0,
  percentageStageReferral: 0,
  tdsPercentage: 0,
  amountReferral: 0,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  tdsFlag: yup
    .mixed<TruthyType>()
    .oneOf(Object.values(TruthyType), "Invalid tds type")
    .required("TDS Type is required"),
  valuation: yup
    .number()
    .typeError("Valuation must be a number")
    .required("Valuation is required"),
  percentageTotal: yup
    .number()
    .typeError("Percentage For Total Billing must be a number")
    .required("Percentage For Total Billing is required"),
  noOfStages: yup
    .number()
    .typeError("No Of Stages must be a number")
    .required("No Of Stages is required"),
  percentageStage: yup
    .number()
    .typeError("Percentage For Each Stage must be a number")
    .required("Percentage For Each Stage is required"),
  noOfStagesReferral: yup
    .number()
    .typeError("No Of Stages For Referral must be a number")
    .required("No Of Stages For Referral is required"),
  percentageStageReferral: yup
    .number()
    .typeError("Percentage For Each Stage For Referral must be a number")
    .required("Percentage For Each Stage For Referral is required"),
  amountReferral: yup
    .number()
    .typeError("Referral amount must be a number")
    .required("Referral amount is required"),
  tdsPercentage: yup
    .number()
    .typeError("TDS Percentage must be a number")
    .required("TDS Percentage is required"),
});
