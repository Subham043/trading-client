import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Box, Button, LoadingOverlay, SimpleGrid, TextInput } from "@mantine/core";
import * as yup from 'yup';
import { AxiosError } from "axios";
import { useAddCompanyMaster, useUpdateCompanyMaster, useCompanyMaster } from "../../hooks/data/company_masters";

type FormType = {
    email?: string | undefined;
    website?: string | undefined;
    nameContactPerson?: string | undefined;
    designationContactPerson?: string | undefined;
    emailContactPerson?: string | undefined;
    phoneContactPerson?: string | undefined;
    fax?: string | undefined;
    telephone?: string | undefined;
    CIN?: string | undefined;
    ISIN: string;
    faceValue: number;
    closingPriceNSE: number;
    closingPriceBSE: number;
    registeredOffice?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    pincode?: number | undefined;
};

const schema: yup.ObjectSchema<FormType> = yup.object().shape({
  email: yup
    .string()
    .typeError('Email must be a string')
    .email('Invalid email')
    .optional(),
  website: yup
    .string()
    .typeError('Website must be a string')
    .url('Invalid url')
    .optional(),
  nameContactPerson: yup
    .string()
    .typeError('Name of Contact Person must be a string')
    .optional(),
  designationContactPerson: yup
    .string()
    .typeError('Designation of Contact Person must be a string')
    .optional(),
  emailContactPerson: yup
    .string()
    .typeError('Email of Contact Person must be a string')
    .email('Invalid email')
    .optional(),
  phoneContactPerson: yup
    .string()
    .typeError('Phone of Contact Person must be a string')
    .optional(),
  fax: yup
    .string()
    .typeError('Fax must be a string')
    .optional(),
  telephone: yup
    .string()
    .typeError('Telephone must be a string')
    .optional(),
  pincode: yup
    .number()
    .typeError('Pincode must be a number')
    .optional(),
  state: yup
    .string()
    .typeError('State must be a string')
    .optional(),
  city: yup
    .string()
    .typeError('City must be a string')
    .optional(),
  registeredOffice: yup
    .string()
    .typeError('Registered Office must be a string')
    .optional(),
  CIN: yup
    .string()
    .typeError('CIN must be a string')
    .optional(),
  ISIN: yup
    .string()
    .typeError('ISIN must be a string')
    .required('ISIN is required'),
  faceValue: yup
    .number()
    .typeError('Face value must be a string')
    .required('Face value is required'),
  closingPriceNSE: yup
    .number()
    .typeError('Closing Price in NSE must be a string')
    .required('Closing Price in NSE is required'),
  closingPriceBSE: yup
    .number()
    .typeError('Closing Price in BSE must be a string')
    .required('Closing Price in BSE is required'),
});


type CompanyMasterFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
const CompanyMasterForm:FC<CompanyMasterFormProps> = (props) => {

    const [loading, setLoading] = useState<boolean>(false);
    const {toastError, toastSuccess} = useToast();
    const {data, isFetching, isLoading} = useCompanyMaster(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addCompanyMaster = useAddCompanyMaster()
    const updateCompanyMaster = useUpdateCompanyMaster(props.type === "Edit" ? props.id : 0)
    const form = useForm<FormType>({
        initialValues: {
            ISIN: '',
            CIN: undefined,
            faceValue: 0.0,
            closingPriceNSE: 0.0,
            closingPriceBSE: 0.0,
            registeredOffice: undefined,
            city: undefined,
            state: undefined,
            pincode: undefined,
            telephone: undefined,
            fax: undefined,
            email: undefined,
            website: undefined,
            nameContactPerson: undefined,
            designationContactPerson: undefined,
            emailContactPerson: undefined,
            phoneContactPerson: undefined,
        },
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                ISIN: data.ISIN,
                CIN: data.CIN,
                faceValue: data.faceValue,
                closingPriceNSE: data.closingPriceNSE,
                closingPriceBSE: data.closingPriceBSE,
                registeredOffice: data.registeredOffice,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                telephone: data.telephone,
                fax: data.fax,
                email: data.email,
                website: data.website,
                nameContactPerson: data.nameContactPerson,
                designationContactPerson: data.designationContactPerson,
                emailContactPerson: data.emailContactPerson,
                phoneContactPerson: data.phoneContactPerson,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        setLoading(true);
        const companyMasterMutateOptions = {
            onSuccess: () => {
                toastSuccess("Company Master " + props.type === "Edit" ? "updated" : "created" + " successfully.")
                props.type==="Create" && form.reset();
            },
            onError: (error:Error) => {
                if(error instanceof AxiosError){
                    if(error?.response?.data?.formErrors?.email){
                        form.setFieldError('email', error.response.data.formErrors?.email[0]);
                    }else if(error?.response?.data?.formErrors?.ISIN){
                        form.setFieldError('ISIN', error.response.data.formErrors?.ISIN[0]);
                    }else if(error?.response?.data?.formErrors?.CIN){
                        form.setFieldError('CIN', error.response.data.formErrors?.CIN[0]);
                    }else if(error?.response?.data?.formErrors?.faceValue){
                        form.setFieldError('faceValue', error.response.data.formErrors?.faceValue[0]);
                    }else if(error?.response?.data?.formErrors?.closingPriceBSE){
                        form.setFieldError('closingPriceBSE', error.response.data.formErrors?.closingPriceBSE[0]);
                    }else if(error?.response?.data?.formErrors?.closingPriceNSE){
                        form.setFieldError('closingPriceNSE', error.response.data.formErrors?.closingPriceNSE[0]);
                    }else if(error?.response?.data?.formErrors?.registeredOffice){
                        form.setFieldError('registeredOffice', error.response.data.formErrors?.registeredOffice[0]);
                    }else if(error?.response?.data?.formErrors?.city){
                        form.setFieldError('city', error.response.data.formErrors?.city[0]);
                    }else if(error?.response?.data?.formErrors?.state){
                        form.setFieldError('state', error.response.data.formErrors?.state[0]);
                    }else if(error?.response?.data?.formErrors?.pincode){
                        form.setFieldError('pincode', error.response.data.formErrors?.pincode[0]);
                    }else if(error?.response?.data?.formErrors?.telephone){
                        form.setFieldError('telephone', error.response.data.formErrors?.telephone[0]);
                    }else if(error?.response?.data?.formErrors?.fax){
                        form.setFieldError('fax', error.response.data.formErrors?.fax[0]);
                    }else if(error?.response?.data?.formErrors?.website){
                        form.setFieldError('website', error.response.data.formErrors?.website[0]);
                    }else if(error?.response?.data?.formErrors?.nameContactPerson){
                        form.setFieldError('nameContactPerson', error.response.data.formErrors?.nameContactPerson[0]);
                    }else if(error?.response?.data?.formErrors?.designationContactPerson){
                        form.setFieldError('designationContactPerson', error.response.data.formErrors?.designationContactPerson[0]);
                    }else if(error?.response?.data?.formErrors?.emailContactPerson){
                        form.setFieldError('emailContactPerson', error.response.data.formErrors?.emailContactPerson[0]);
                    }else if(error?.response?.data?.formErrors?.phoneContactPerson){
                        form.setFieldError('phoneContactPerson', error.response.data.formErrors?.phoneContactPerson[0]);
                    }else if(error?.response?.data?.message){
                        toastError(error.response.data.message);
                    }
                }else{
                    toastError('Something went wrong. Please try again later.');
                }
            },
            onSettled: () => setLoading(false)
        }
        const formData = {
            ISIN: form.values.ISIN,
            closingPriceBSE: Number(form.values.closingPriceBSE),
            closingPriceNSE: Number(form.values.closingPriceNSE),
            faceValue: Number(form.values.faceValue),
            email: (form.values.email && form.values.email.length>0) ? form.values.email : undefined,
            website: (form.values.website && form.values.website.length>0) ? form.values.website : undefined,
            nameContactPerson: (form.values.nameContactPerson && form.values.nameContactPerson.length>0) ? form.values.nameContactPerson : undefined,
            designationContactPerson: (form.values.designationContactPerson && form.values.designationContactPerson.length>0) ? form.values.designationContactPerson : undefined,
            emailContactPerson: (form.values.emailContactPerson && form.values.emailContactPerson.length>0) ? form.values.emailContactPerson : undefined,
            phoneContactPerson: (form.values.phoneContactPerson && form.values.phoneContactPerson.length>0) ? form.values.phoneContactPerson : undefined,
            CIN: (form.values.CIN && form.values.CIN.length>0) ? form.values.CIN : undefined,
            city: (form.values.city && form.values.city.length>0) ? form.values.city : undefined,
            state: (form.values.state && form.values.state.length>0) ? form.values.state : undefined,
            registeredOffice: (form.values.registeredOffice && form.values.registeredOffice.length>0) ? form.values.registeredOffice : undefined,
            pincode: (form.values.pincode) ? Number(form.values.pincode) : undefined,
            telephone: (form.values.telephone && form.values.telephone.length>0) ? form.values.telephone : undefined,
            fax: (form.values.fax && form.values.fax.length>0) ? form.values.fax : undefined,
        }
        if(props.type === "Edit"){
            updateCompanyMaster.mutateAsync(
                formData,
                {
                    onError: (error) => companyMasterMutateOptions.onError(error), 
                    onSuccess: () => companyMasterMutateOptions.onSuccess(), 
                    onSettled: () => companyMasterMutateOptions.onSettled(),
                }
            );
        }else{
            addCompanyMaster.mutateAsync(
                formData,
                {
                    onError: (error) => companyMasterMutateOptions.onError(error), 
                    onSuccess: () => companyMasterMutateOptions.onSuccess(), 
                    onSettled: () => companyMasterMutateOptions.onSettled(),
                }
            );
        }
    };

    return (
        <Box pos="relative">
            <LoadingOverlay visible={isLoading || isFetching} zIndex={20} overlayProps={{ radius: "sm", blur: 2 }} />
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput withAsterisk data-autofocus label="ISIN" {...form.getInputProps('ISIN')} />
                    <TextInput label="CIN" {...form.getInputProps('CIN')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput withAsterisk label="Face Value" {...form.getInputProps('faceValue')} />
                    <TextInput withAsterisk label="Closing Price in NSE" {...form.getInputProps('closingPriceNSE')} />
                    <TextInput withAsterisk label="Closing Price in BSE" {...form.getInputProps('closingPriceBSE')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Registered Office" {...form.getInputProps('registeredOffice')} />
                    <TextInput label="City" {...form.getInputProps('city')} />
                    <TextInput label="State" {...form.getInputProps('state')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Pincode" {...form.getInputProps('pincode')} />
                    <TextInput label="Telephone" {...form.getInputProps('telephone')} />
                    <TextInput label="Fax" {...form.getInputProps('fax')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Email" {...form.getInputProps('email')} />
                    <TextInput label="Website" {...form.getInputProps('website')} />
                    <TextInput label="Name of Contact Person" {...form.getInputProps('nameContactPerson')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Designation of Contact Person" {...form.getInputProps('designationContactPerson')} />
                    <TextInput label="Email of Contact Person" {...form.getInputProps('emailContactPerson')} />
                    <TextInput label="Phone of Contact Person" {...form.getInputProps('phoneContactPerson')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={loading} disabled={loading} data-disabled={loading}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </Box>
    )
}

export default CompanyMasterForm