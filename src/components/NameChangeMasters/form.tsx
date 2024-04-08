import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { DateInput } from '@mantine/dates';
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddNameChangeMasterMutation, useNameChangeMasterQuery, useNameChangeMasterLatestQuery, useUpdateNameChangeMasterMutation } from "../../hooks/data/name_change_masters";
import { MutateOptions } from "@tanstack/react-query";
import { useCompanyMasterQuerySetData } from "../../hooks/data/company_masters";
import { AxiosErrorResponseType, NameChangeMasterFormType, NameChangeMasterType } from "../../utils/types";
import { NameChangeMastersListModalProps } from "../../pages/nameChangeMasters/list";
import { SchemaType, initialValues, schema, transformValues } from "./schema";
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

    const {toastError} = useToast();
    const {data:newData, isFetching:isNewFetching, isLoading:isNewLoading, status:newStatus, error:newError,  refetch:newRefetch} = useNameChangeMasterLatestQuery(props.mainCompanyId, (props.type === "Create" && props.status));
    const {data, isFetching, isLoading, status, error,  refetch} = useNameChangeMasterQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addNameChangeMaster = useAddNameChangeMasterMutation(props.mainCompanyId)
    const updateNameChangeMaster = useUpdateNameChangeMasterMutation(props.type === "Edit" ? props.id : 0, props.mainCompanyId)
    const { updateCompanyMaster } = useCompanyMasterQuerySetData();
    const form = useForm<SchemaType>({
        initialValues,
        transformValues,
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
                if(props.type === "Edit"){
                    updateCompanyMaster(data ? data.companyId : 0, {
                        BSE: form.getTransformedValues().BSE,
                        NSE: form.getTransformedValues().NSE,
                        newName: form.getTransformedValues().newName,
                        id: data ? data.companyId : 0,
                        nameChangeMasterId: data ? data.id : 0,
                        createdAt: new Date().toISOString(),
                    })
                }else{
                    updateCompanyMaster(newData ? newData.companyId : 0, {
                        BSE: form.getTransformedValues().BSE,
                        NSE: form.getTransformedValues().NSE,
                        newName: form.getTransformedValues().newName,
                        id: newData ? newData.companyId : 0,
                        nameChangeMasterId: newData ? newData.id : 0,
                        createdAt: new Date().toISOString(),
                    })
                }
            },
            onError: (error:Error) => {
                if(isAxiosError<AxiosErrorResponseType>(error)){
                    if(error?.response?.data?.formErrors){
                        for (const [key, value] of Object.entries(error?.response?.data?.formErrors)) {
                            form.setFieldError(key, value[0]);
                        }
                    }else if(error?.response?.data?.message){
                        toastError(error.response.data.message);
                    }
                }
            }
        }
        
        if(props.type === "Edit"){
            await updateNameChangeMaster.mutateAsync(form.getTransformedValues(), nameChangeMasterMutateOptions);
        }else{
            await addNameChangeMaster.mutateAsync(form.getTransformedValues(), nameChangeMasterMutateOptions);
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