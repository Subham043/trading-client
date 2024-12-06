import * as yup from "yup";


export type SchemaType = {
  shareHolderDetails?: string | undefined | null;
  legalHeirDetails?: string | undefined | null;
};

export const initialValues: SchemaType = {
  shareHolderDetails: undefined,
  legalHeirDetails: undefined,
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  shareHolderDetails: yup.string().trim().notRequired(),
  legalHeirDetails: yup.string().trim().notRequired(),
});
