import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { DateInput } from '@mantine/dates';
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddNameChangeMasterMutation, useNameChangeMasterQuery, useNameChangeMasterLatestQuery, useUpdateNameChangeMasterMutation } from "../../hooks/data/name_change_masters";
import { MutateOptions, useQueryClient } from "@tanstack/react-query";
import { CompanyMasterKey } from "../../hooks/data/company_masters";
import { CompanyMasterType, NameChangeMasterFormType, NameChangeMasterType } from "../../utils/types";
import { NameChangeMastersListModalProps } from "../../pages/nameChangeMasters/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";


type NameChangeMasterFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type nameChangeMasterMutateOptionsType = MutateOptions<NameChangeMasterType, Error, NameChangeMasterFormType, unknown>;

const NameChangeMasterForm:FC<NameChangeMasterFormProps & {mainCompanyId: number, toggleModal: (value: NameChangeMastersListModalProps) => void}> = (props) => {

    const queryClient = useQueryClient();
    const {toastError} = useToast();
    const {data:newData, isFetching:isNewFetching, isLoading:isNewLoading, status:newStatus, error:newError,  refetch:newRefetch} = useNameChangeMasterLatestQuery(props.mainCompanyId, (props.type === "Create" && props.status));
    const {data, isFetching, isLoading, status, error,  refetch} = useNameChangeMasterQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addNameChangeMaster = useAddNameChangeMasterMutation(props.mainCompanyId)
    const updateNameChangeMaster = useUpdateNameChangeMasterMutation(props.type === "Edit" ? props.id : 0, props.mainCompanyId)
    const form = useForm<SchemaType>({
        initialValues,
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
                newRTA: data.newRTA ? data.newRTA : undefined,
                previousRTA: data.previousRTA ? data.previousRTA : undefined,
                dateRTAChange: data.dateRTAChange ? data.dateRTAChange : undefined,
                newSecuritySymbol: data.newSecuritySymbol ? data.newSecuritySymbol : undefined,
                oldSecuritySymbol: data.oldSecuritySymbol ? data.oldSecuritySymbol : undefined,
                dateSecurityChange: data.dateSecurityChange ? data.dateSecurityChange : undefined,
            });
        }else if(props.type === "Create" && newData && props.status){
            form.setValues({
                BSE: newData.BSE ? newData.BSE : undefined,
                NSE: newData.NSE ? newData.NSE : undefined,
                previousName: newData.newName ? newData.newName : undefined,
                dateNameChange: newData.dateNameChange ? newData.dateNameChange : undefined,
                previousRTA: newData.newRTA ? newData.newRTA : undefined,
                dateRTAChange: newData.dateRTAChange ? newData.dateRTAChange : undefined,
                oldSecuritySymbol: newData.newSecuritySymbol ? newData.newSecuritySymbol : undefined,
                dateSecurityChange: newData.dateSecurityChange ? newData.dateSecurityChange : undefined,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, newData, props.type, props.status]);
    
    const onSubmit = async () => {
        const nameChangeMasterMutateOptions:nameChangeMasterMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", companyId: props.mainCompanyId});
            },
            onError: (error:Error) => {
                if(isAxiosError(error)){
                    if(error?.response?.data?.formErrors?.newName){
                        form.setFieldError('newName', error.response.data.formErrors?.newName[0]);
                    }else if(error?.response?.data?.formErrors?.previousName){
                        form.setFieldError('previousName', error.response.data.formErrors?.previousName[0]);
                    }else if(error?.response?.data?.formErrors?.newRTA){
                        form.setFieldError('newRTA', error.response.data.formErrors?.newRTA[0]);
                    }else if(error?.response?.data?.formErrors?.previousRTA){
                        form.setFieldError('previousRTA', error.response.data.formErrors?.previousRTA[0]);
                    }else if(error?.response?.data?.formErrors?.BSE){
                        form.setFieldError('BSE', error.response.data.formErrors?.BSE[0]);
                    }else if(error?.response?.data?.formErrors?.NSE){
                        form.setFieldError('NSE', error.response.data.formErrors?.NSE[0]);
                    }else if(error?.response?.data?.formErrors?.dateNameChange){
                        form.setFieldError('dateNameChange', error.response.data.formErrors?.dateNameChange[0]);
                    }else if(error?.response?.data?.formErrors?.dateRTAChange){
                        form.setFieldError('dateRTAChange', error.response.data.formErrors?.dateRTAChange[0]);
                    }else if(error?.response?.data?.formErrors?.newSecuritySymbol){
                        form.setFieldError('newSecuritySymbol', error.response.data.formErrors?.newSecuritySymbol[0]);
                    }else if(error?.response?.data?.formErrors?.oldSecuritySymbol){
                        form.setFieldError('oldSecuritySymbol', error.response.data.formErrors?.oldSecuritySymbol[0]);
                    }else if(error?.response?.data?.formErrors?.dateSecurityChange){
                        form.setFieldError('dateSecurityChange', error.response.data.formErrors?.dateSecurityChange[0]);
                    }else if(error?.response?.data?.message){
                        toastError(error.response.data.message);
                    }
                }
            }
        }
        const formData = {
            BSE: (form.values.BSE && form.values.BSE.length>0) ? form.values.BSE : undefined,
            NSE: (form.values.NSE && form.values.NSE.length>0) ? form.values.NSE : undefined,
            newName: (form.values.newName && form.values.newName.length>0) ? form.values.newName : undefined,
            previousName: (form.values.previousName && form.values.previousName.length>0) ? form.values.previousName : undefined,
            dateNameChange: (form.values.dateNameChange && form.values.dateNameChange.length>0) ? form.values.dateNameChange : undefined,
            newRTA: (form.values.newRTA && form.values.newRTA.length>0) ? form.values.newRTA : undefined,
            previousRTA: (form.values.previousRTA && form.values.previousRTA.length>0) ? form.values.previousRTA : undefined,
            dateRTAChange: (form.values.dateRTAChange && form.values.dateRTAChange.length>0) ? form.values.dateRTAChange : undefined,
            newSecuritySymbol: (form.values.newSecuritySymbol && form.values.newSecuritySymbol.length>0) ? form.values.newSecuritySymbol : undefined,
            oldSecuritySymbol: (form.values.oldSecuritySymbol && form.values.oldSecuritySymbol.length>0) ? form.values.oldSecuritySymbol : undefined,
            dateSecurityChange: (form.values.dateSecurityChange && form.values.dateSecurityChange.length>0) ? form.values.dateSecurityChange : undefined,
        }
        if(props.type === "Edit"){
            await updateNameChangeMaster.mutateAsync(formData, nameChangeMasterMutateOptions);
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
            await addNameChangeMaster.mutateAsync(formData, nameChangeMasterMutateOptions);
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
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): (newData ? true : false)} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (isNewLoading || isNewFetching)} status={props.status && props.type==="Edit" ? status : newStatus} error={props.status && props.type==="Edit" ? error : newError} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : newRefetch}>
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
                    <TextInput label="New RTA" {...form.getInputProps('newRTA')} />
                    <TextInput label="Previous RTA" {...form.getInputProps('previousRTA')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="New Security Symbol" {...form.getInputProps('newSecuritySymbol')} />
                    <TextInput label="Old Security Symbol" {...form.getInputProps('oldSecuritySymbol')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <DateInput
                        value={form.values.dateNameChange ? new Date(form.values.dateNameChange) : undefined}
                        onChange={(value) => form.setFieldValue('dateNameChange', value?.toISOString())}
                        label="Date of Name Change"
                        placeholder="Date of Name Change"
                    />
                    <DateInput
                        value={form.values.dateRTAChange ? new Date(form.values.dateRTAChange) : undefined}
                        onChange={(value) => form.setFieldValue('dateRTAChange', value?.toISOString())}
                        label="Date of RTA Change"
                        placeholder="Date of RTA Change"
                    />
                    <DateInput
                        value={form.values.dateSecurityChange ? new Date(form.values.dateSecurityChange) : undefined}
                        onChange={(value) => form.setFieldValue('dateSecurityChange', value?.toISOString())}
                        label="Date of Security Change"
                        placeholder="Date of Security Change"
                    />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addNameChangeMaster.isPending : updateNameChangeMaster.isPending} disabled={props.type === "Create" ? addNameChangeMaster.isPending : updateNameChangeMaster.isPending} data-disabled={props.type === "Create" ? addNameChangeMaster.isPending : updateNameChangeMaster.isPending}>
                    {props.type === "Create" ? "Change" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default NameChangeMasterForm