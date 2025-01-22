import * as yup from "yup";


export type SchemaType = {
  fullName: string;
  fatherName: string;
  isMinor: string;
  isDeceased: string;
  occupation?: string | null | undefined;
  nationality?: string | null | undefined;
  email?: string | null | undefined;
  relationship?: string | null | undefined;
  mobile?: string | null | undefined;
  pan?: string | null | undefined;
  address?: string | null | undefined;
  dobMinor?: string | null | undefined;
  dateMajority?: string | null | undefined;
  gurdianName?: string | null | undefined;
  gurdianAddress?: string | null | undefined;
  deceasedName?: string | null | undefined;
  dobDeceased?: string | null | undefined;
  deceasedFatherName?: string | null | undefined;
  deceasedOccupation?: string | null | undefined;
  deceasedNationality?: string | null | undefined;
  deceasedEmail?: string | null | undefined;
  deceasedRelationship?: string | null | undefined;
  deceasedRelationshipMinor?: string | null | undefined;
};

export const initialValues: SchemaType = {
  isMinor: "No",
  isDeceased: "No",
  fatherName: "",
  fullName: "",
  occupation: undefined,
  nationality: undefined,
  email: undefined,
  relationship: undefined,
  mobile: undefined,
  pan: undefined,
  address: undefined,
  dobMinor: undefined,
  dateMajority: undefined,
  gurdianName: undefined,
  gurdianAddress: undefined,
  deceasedName: undefined,
  dobDeceased: undefined,
  deceasedFatherName: undefined,
  deceasedOccupation: undefined,
  deceasedNationality: undefined,
  deceasedEmail: undefined,
  deceasedRelationship: undefined,
  deceasedRelationshipMinor: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  fatherName: yup.string().trim().required(),
  fullName: yup.string().trim().required(),
  isMinor: yup.string().trim().required(),
  isDeceased: yup.string().trim().required(),
  occupation: yup.string().trim().notRequired(),
  nationality: yup.string().trim().notRequired(),
  email: yup.string().trim().notRequired(),
  relationship: yup.string().trim().notRequired(),
  mobile: yup.string().trim().notRequired(),
  pan: yup.string().trim().notRequired(),
  address: yup.string().trim().notRequired(),
  dobMinor: yup.string().trim().notRequired(),
  dateMajority: yup.string().trim().notRequired(),
  gurdianName: yup.string().trim().notRequired(),
  gurdianAddress: yup.string().trim().notRequired(),
  deceasedName: yup.string().trim().notRequired(),
  dobDeceased: yup.string().trim().notRequired(),
  deceasedFatherName: yup.string().trim().notRequired(),
  deceasedOccupation: yup.string().trim().notRequired(),
  deceasedNationality: yup.string().trim().notRequired(),
  deceasedEmail: yup.string().trim().notRequired(),
  deceasedRelationship: yup.string().trim().notRequired(),
  deceasedRelationshipMinor: yup.string().trim().notRequired(),
});
