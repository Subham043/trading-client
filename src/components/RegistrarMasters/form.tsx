import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddRegistrarMasterMutation, useUpdateRegistrarMasterMutation, useRegistrarMasterQuery, useCompanyMastersSelectQuery } from "../../hooks/data/registrar_masters";
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
    const {data: companyMastersSelect, isFetching:isCompanyMastersSelectFetching, isLoading:isCompanyMastersSelectLoading} = useCompanyMastersSelectQuery({enabled:props.status, companyId:props.type === "Edit" ? (data && data.companyId ? data.companyId : undefined) : undefined});
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
                address: data.address ? data.address : undefined,
                telephone1: data.telephone1 ? data.telephone1 : undefined,
                telephone2: data.telephone2 ? data.telephone2 : undefined,
                email: data.email ? data.email : undefined,
                website: data.website ? data.website : undefined,
                nameContactPerson: data.nameContactPerson ? data.nameContactPerson : undefined,
                designationContactPerson: data.designationContactPerson ? data.designationContactPerson : undefined,
                emailContactPerson: data.emailContactPerson ? data.emailContactPerson : undefined,
                phoneContactPerson: data.phoneContactPerson ? data.phoneContactPerson : undefined,
                officerAssigned: data.officerAssigned ? data.officerAssigned : undefined,
                branch: data.branch ? data.branch : undefined,
                city: data.city ? data.city : undefined,
                state: data.state ? data.state : undefined,
                pincode: data.pincode ? Number(data.pincode) : undefined,
                companyId: data.companyId ? data.companyId : undefined
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
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    <Select
                        withAsterisk
                        data-autofocus
                        label="Company Name"
                        placeholder="Pick Company"
                        maxDropdownHeight={200}
                        data={companyMastersSelect ? companyMastersSelect.map((item) => ({label: item.newName ? item.newName : "", value: item.companyID ? item.companyID.toString() : ""})) : []}
                        searchable
                        clearable
                        nothingFoundMessage="Nothing found..."
                        disabled={isCompanyMastersSelectFetching || isCompanyMastersSelectLoading}
                        error={form.errors.companyId}
                        value={form.values.companyId ? form.values.companyId.toString() : undefined}
                        onChange={(value) => form.setFieldValue('companyId', value ? Number(value) : undefined)}
                    />
                    <TextInput withAsterisk label="Registrar Name" {...form.getInputProps('registrar_name')} />
                    <TextInput withAsterisk label="SEBI Regn ID" {...form.getInputProps('sebi_regn_id')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Address" {...form.getInputProps('address')} />
                    <TextInput label="Branch" {...form.getInputProps('branch')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Telephone 1" {...form.getInputProps('telephone1')} />
                    <TextInput label="Telephone 2" {...form.getInputProps('telephone2')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Email" {...form.getInputProps('email')} />
                    <TextInput label="Website" {...form.getInputProps('website')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="City" {...form.getInputProps('city')} />
                    <TextInput label="State" {...form.getInputProps('state')} />
                    <TextInput label="Pincode" {...form.getInputProps('pincode')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Name of Contact Person" {...form.getInputProps('nameContactPerson')} />
                    <TextInput label="Designation of Contact Person" {...form.getInputProps('designationContactPerson')} />
                    <TextInput label="Email of Contact Person" {...form.getInputProps('emailContactPerson')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Phone of Contact Person" {...form.getInputProps('phoneContactPerson')} />
                    <TextInput label="Officer Assigned" {...form.getInputProps('officerAssigned')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addRegistrarMaster.isPending : updateRegistrarMaster.isPending} disabled={props.type === "Create" ? addRegistrarMaster.isPending : updateRegistrarMaster.isPending} data-disabled={props.type === "Create" ? addRegistrarMaster.isPending : updateRegistrarMaster.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default RegistrarMasterForm