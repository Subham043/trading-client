import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { DateInput } from '@mantine/dates';
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddNameChangeMasterMutation, useNameChangeMasterQuery, useNameChangeMasterLatestQuery, useUpdateNameChangeMasterMutation } from "../../hooks/data/name_change_masters";
import { MutateOptions } from "@tanstack/react-query";
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
                currentName: data.currentName ? data.currentName : undefined,
                previousName: data.previousName ? data.previousName : undefined,
                dateNameChange: data.dateNameChange ? data.dateNameChange : undefined,
            });
        }else if(props.type === "Create" && newData && props.status){
            form.setValues({
                BSE: (newData && newData.currentNameChangeMasters && newData.currentNameChangeMasters.BSE) ? newData.currentNameChangeMasters.BSE : undefined,
                NSE: (newData && newData.currentNameChangeMasters && newData.currentNameChangeMasters.NSE) ? newData.currentNameChangeMasters.NSE : undefined,
                previousName: (newData && newData.currentNameChangeMasters && newData.currentNameChangeMasters.currentName) ? newData.currentNameChangeMasters.currentName : undefined,
                dateNameChange: (newData && newData.currentNameChangeMasters && newData.currentNameChangeMasters.dateNameChange) ? newData.currentNameChangeMasters.dateNameChange.toString() as string : undefined,
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
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput label="NSE" {...form.getInputProps('NSE')} />
                    <TextInput label="BSE" {...form.getInputProps('BSE')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="New Name" {...form.getInputProps('currentName')} />
                    <TextInput label="Previous Name" {...form.getInputProps('previousName')} />
                    <DateInput
                        value={form.values.dateNameChange ? new Date(form.values.dateNameChange) : undefined}
                        onChange={(value) => form.setFieldValue('dateNameChange', value?.toISOString())}
                        label="Date of Name Change"
                        placeholder="Date of Name Change"
                        valueFormat="DD/MM/YYYY"
                        error={form.errors.dateNameChange}
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