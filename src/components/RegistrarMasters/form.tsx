import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddRegistrarMasterMutation, useUpdateRegistrarMasterMutation, useRegistrarMasterQuery } from "../../hooks/data/registrar_masters";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, RegistrarMasterFormType, RegistrarMasterType } from "../../utils/types";
import { RegistrarMastersModalProps } from "../../pages/registrarMasters/list";
import { SchemaType, initialValues, schema, transformValues } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";

type RegistrarMasterFormProps = RegistrarMastersModalProps;
type registrarMasterMutateOptionsType = MutateOptions<RegistrarMasterType, Error, RegistrarMasterFormType, unknown>;

const RegistrarMasterForm:FC<RegistrarMasterFormProps & {toggleModal: (value: RegistrarMastersModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error, refetch} = useRegistrarMasterQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addRegistrarMaster = useAddRegistrarMasterMutation()
    const updateRegistrarMaster = useUpdateRegistrarMasterMutation(props.type === "Edit" ? props.id : 0)
    const form = useForm<SchemaType>({
        initialValues,
        transformValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                registrar_name: data.registrar_name ? data.registrar_name : undefined,
                sebi_regn_id: data.sebi_regn_id ? data.sebi_regn_id : undefined,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const registrarMasterMutateOptions:registrarMasterMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({type: "Create", status: false});
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
            await updateRegistrarMaster.mutateAsync(form.getTransformedValues(), registrarMasterMutateOptions);
        }else{
            await addRegistrarMaster.mutateAsync(form.getTransformedValues(), registrarMasterMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={isLoading || isFetching} status={props.status && props.type==="Edit" ? status : "success"} error={error} hasPagination={false} refetch={refetch}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 1 }}>
                    <TextInput withAsterisk label="Registrar Name" {...form.getInputProps('registrar_name')} />
                    <TextInput withAsterisk label="SEBI Regn ID" {...form.getInputProps('sebi_regn_id')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addRegistrarMaster.isPending : updateRegistrarMaster.isPending} disabled={props.type === "Create" ? addRegistrarMaster.isPending : updateRegistrarMaster.isPending} data-disabled={props.type === "Create" ? addRegistrarMaster.isPending : updateRegistrarMaster.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default RegistrarMasterForm