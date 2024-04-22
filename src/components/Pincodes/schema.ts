import * as yup from "yup";

export type SchemaType = {
  circle_name: string;
  region_name: string;
  division_name: string;
  office_name: string;
  pincode: string;
  office_type: string;
  district: string;
  state_name: string;
};

export const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  circle_name: yup.string().required("Circle Name is required"),
  region_name: yup.string().required("Region Name is required"),
  division_name: yup.string().required("Division Name is required"),
  office_name: yup.string().required("Office Name is required"),
  state_name: yup.string().required("State Name is required"),
  pincode: yup.string().required("Pincode is required"),
  office_type: yup.string().required("Office Type is required"),
  district: yup.string().required("District is required"),
});
