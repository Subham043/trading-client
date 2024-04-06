import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { DateInput } from '@mantine/dates';
import { yupResolver } from "mantine-form-yup-resolver";
import { Box, Button, LoadingOverlay, SimpleGrid, TextInput } from "@mantine/core";
import * as yup from 'yup';
import { AxiosError } from "axios";
import { useAddNameChangeMaster, useNameChangeMaster, useNameChangeMasterLatest, useUpdateNameChangeMaster } from "../../hooks/data/name_change_masters";
import { useQueryClient } from "@tanstack/react-query";
import { CompanyMasterKey } from "../../hooks/data/company_masters";
import { CompanyMasterType } from "../../utils/types";

type FormType = {
    newName?: string | undefined;
    previousName?: string | undefined;
    dateNameChange?: string | undefined;
    BSE?: string | undefined;
    NSE?: string | undefined;
    newSecuritySymbol?: string | undefined;
    oldSecuritySymbol?: string | undefined;
    dateSecurityChange?: string | undefined;
};

const schema: yup.ObjectSchema<FormType> = yup.object().shape({
  BSE: yup
    .string()
    .typeError('BSE must be a string')
    .optional(),
  NSE: yup
    .string()
    .typeError('NSE must be a string')
    .optional(),
  newName: yup
    .string()
    .typeError('New Name must be a string')
    .optional(),
  previousName: yup
    .string()
    .typeError('Previous Name must be a string')
    .optional(),
  dateNameChange: yup
    .string()
    .typeError('Date of Name Change must be a string')
    .optional(),
  newSecuritySymbol: yup
    .string()
    .typeError('New Security Symbol must be a string')
    .optional(),
  oldSecuritySymbol: yup
    .string()
    .typeError('Old Security Symbol must be a string')
    .optional(),
  dateSecurityChange: yup
    .string()
    .typeError('Date of Security Change must be a string')
    .optional(),
});


type NameChangeMasterFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
const NameChangeMasterForm:FC<NameChangeMasterFormProps & {mainCompanyId: number}> = (props) => {

    const [loading, setLoading] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const {toastError, toastSuccess} = useToast();
    const {data:newData, isFetching:isNewFetching, isLoading:isNewLoading} = useNameChangeMasterLatest(props.mainCompanyId, (props.type === "Create" && props.status));
    const {data, isFetching, isLoading} = useNameChangeMaster(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addNameChangeMaster = useAddNameChangeMaster(props.mainCompanyId)
    const updateNameChangeMaster = useUpdateNameChangeMaster(props.type === "Edit" ? props.id : 0, props.mainCompanyId)
    const form = useForm<FormType>({
        initialValues: {
            newName: undefined,
            previousName: undefined,
            dateNameChange: undefined,
            BSE: undefined,
            NSE: undefined,
            newSecuritySymbol: undefined,
            oldSecuritySymbol: undefined,
            dateSecurityChange: undefined,
        },
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                BSE: data.BSE ? data.BSE : undefined,
                NSE: data.NSE ? data.NSE : undefined,
                newName: data.newName ? data.newName : undefined,
                previousName: data.previousName ? data.previousName : undefined,
                dateNameChange: data.dateNameChange ? data.dateNameChange : undefined,
                newSecuritySymbol: data.newSecuritySymbol ? data.newSecuritySymbol : undefined,
                oldSecuritySymbol: data.oldSecuritySymbol ? data.oldSecuritySymbol : undefined,
                dateSecurityChange: data.dateSecurityChange ? data.dateSecurityChange : undefined,
            });
        }else if(props.type === "Create" && newData && props.status){
            form.setValues({
                BSE: newData.BSE ? newData.BSE : undefined,
                NSE: newData.NSE ? newData.NSE : undefined,
                newName: newData.newName ? newData.newName : undefined,
                previousName: newData.previousName ? newData.previousName : undefined,
                dateNameChange: newData.dateNameChange ? newData.dateNameChange : undefined,
                newSecuritySymbol: newData.newSecuritySymbol ? newData.newSecuritySymbol : undefined,
                oldSecuritySymbol: newData.oldSecuritySymbol ? newData.oldSecuritySymbol : undefined,
                dateSecurityChange: newData.dateSecurityChange ? newData.dateSecurityChange : undefined,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, newData, props.type, props.status]);
    
    const onSubmit = async () => {
        setLoading(true);
        const nameChangeMasterMutateOptions = {
            onSuccess: () => {
                toastSuccess("Name Change Master " + props.type === "Edit" ? "updated" : "created" + " successfully.")
                props.type==="Create" && form.reset();
            },
            onError: (error:Error) => {
                if(error instanceof AxiosError){
                    if(error?.response?.data?.formErrors?.newName){
                        form.setFieldError('newName', error.response.data.formErrors?.newName[0]);
                    }else if(error?.response?.data?.formErrors?.previousName){
                        form.setFieldError('previousName', error.response.data.formErrors?.previousName[0]);
                    }else if(error?.response?.data?.formErrors?.BSE){
                        form.setFieldError('BSE', error.response.data.formErrors?.BSE[0]);
                    }else if(error?.response?.data?.formErrors?.NSE){
                        form.setFieldError('NSE', error.response.data.formErrors?.NSE[0]);
                    }else if(error?.response?.data?.formErrors?.dateNameChange){
                        form.setFieldError('dateNameChange', error.response.data.formErrors?.dateNameChange[0]);
                    }else if(error?.response?.data?.formErrors?.newSecuritySymbol){
                        form.setFieldError('newSecuritySymbol', error.response.data.formErrors?.newSecuritySymbol[0]);
                    }else if(error?.response?.data?.formErrors?.oldSecuritySymbol){
                        form.setFieldError('oldSecuritySymbol', error.response.data.formErrors?.oldSecuritySymbol[0]);
                    }else if(error?.response?.data?.formErrors?.dateSecurityChange){
                        form.setFieldError('dateSecurityChange', error.response.data.formErrors?.dateSecurityChange[0]);
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
            BSE: (form.values.BSE && form.values.BSE.length>0) ? form.values.BSE : undefined,
            NSE: (form.values.NSE && form.values.NSE.length>0) ? form.values.NSE : undefined,
            newName: (form.values.newName && form.values.newName.length>0) ? form.values.newName : undefined,
            previousName: (form.values.previousName && form.values.previousName.length>0) ? form.values.previousName : undefined,
            dateNameChange: (form.values.dateNameChange && form.values.dateNameChange.length>0) ? form.values.dateNameChange : undefined,
            newSecuritySymbol: (form.values.newSecuritySymbol && form.values.newSecuritySymbol.length>0) ? form.values.newSecuritySymbol : undefined,
            oldSecuritySymbol: (form.values.oldSecuritySymbol && form.values.oldSecuritySymbol.length>0) ? form.values.oldSecuritySymbol : undefined,
            dateSecurityChange: (form.values.dateSecurityChange && form.values.dateSecurityChange.length>0) ? form.values.dateSecurityChange : undefined,
        }
        if(props.type === "Edit"){
            updateNameChangeMaster.mutateAsync(
                formData,
                {
                    onError: (error) => nameChangeMasterMutateOptions.onError(error), 
                    onSuccess: () => nameChangeMasterMutateOptions.onSuccess(), 
                    onSettled: () => nameChangeMasterMutateOptions.onSettled(),
                }
            );
            queryClient.setQueryData<CompanyMasterType>([CompanyMasterKey, data ? data.companyId : undefined], (prev) => {
                if(prev){
                    return {
                        ...prev,
                        newName: (form.values.newName && form.values.newName.length>0) ? form.values.newName : undefined,
                        BSE: (form.values.BSE && form.values.BSE.length>0) ? form.values.BSE : undefined,
                        NSE: (form.values.NSE && form.values.NSE.length>0) ? form.values.NSE : undefined,
                    }
                }
            });
        }else{
            addNameChangeMaster.mutateAsync(
                formData,
                {
                    onError: (error) => nameChangeMasterMutateOptions.onError(error), 
                    onSuccess: () => nameChangeMasterMutateOptions.onSuccess(), 
                    onSettled: () => nameChangeMasterMutateOptions.onSettled(),
                }
            );
            queryClient.setQueryData<CompanyMasterType>([CompanyMasterKey, newData ? newData.companyId : undefined], (prev) => {
                if(prev){
                    return {
                        ...prev,
                        newName: (form.values.newName && form.values.newName.length>0) ? form.values.newName : undefined,
                        BSE: (form.values.BSE && form.values.BSE.length>0) ? form.values.BSE : undefined,
                        NSE: (form.values.NSE && form.values.NSE.length>0) ? form.values.NSE : undefined,
                    }
                }
            });
        }
    };

    return (
        <Box pos="relative">
            <LoadingOverlay visible={isLoading || isFetching || isNewFetching || isNewLoading} zIndex={20} overlayProps={{ radius: "sm", blur: 2 }} />
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="NSE" {...form.getInputProps('NSE')} />
                    <TextInput label="BSE" {...form.getInputProps('BSE')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="New Name" {...form.getInputProps('newName')} />
                    <TextInput label="Previous Name" {...form.getInputProps('previousName')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="New Security Symbol" {...form.getInputProps('newSecuritySymbol')} />
                    <TextInput label="Old Security Symbol" {...form.getInputProps('oldSecuritySymbol')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <DateInput
                        value={form.values.dateNameChange ? new Date(form.values.dateNameChange) : undefined}
                        onChange={(value) => form.setFieldValue('dateNameChange', value?.toISOString())}
                        label="Date of Name Change"
                        placeholder="Date of Name Change"
                    />
                    <DateInput
                        value={form.values.dateSecurityChange ? new Date(form.values.dateSecurityChange) : undefined}
                        onChange={(value) => form.setFieldValue('dateSecurityChange', value?.toISOString())}
                        label="Date of Security Change"
                        placeholder="Date of Security Change"
                    />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={loading} disabled={loading} data-disabled={loading}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </Box>
    )
}

export default NameChangeMasterForm