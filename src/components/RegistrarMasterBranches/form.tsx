import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddRegistrarMasterBranchMutation, useRegistrarMasterBranchQuery, useUpdateRegistrarMasterBranchMutation } from "../../hooks/data/registrar_master_branches";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, RegistrarMasterBranchFormType, RegistrarMasterBranchType } from "../../utils/types";
import { RegistrarMasterBranchesListModalProps } from "../../pages/registrarMasterBranches/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { usePincodesSelectQuery } from "../../hooks/data/pincodes";
import debounce from "lodash.debounce";


type RegistrarMasterBranchesFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type registrarMasterBranchesMutateOptionsType = MutateOptions<RegistrarMasterBranchType, Error, RegistrarMasterBranchFormType, unknown>;

const RegistrarMasterBranchesForm:FC<RegistrarMasterBranchesFormProps & {mainRegistrarMasterId: number, toggleModal: (value: RegistrarMasterBranchesListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const [search, setSearch] = useState<string>("");
    const searchHandler = debounce((value: string) => setSearch(value), 500);
    const {data:pincodes, isFetching:isPincodeFetching, isLoading:isPincodeLoading} = usePincodesSelectQuery({search: search, enabled:props.status});
    const {data, isFetching, isLoading, status, error,  refetch} = useRegistrarMasterBranchQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addRegistrarMasterBranches = useAddRegistrarMasterBranchMutation(props.mainRegistrarMasterId)
    const updateRegistrarMasterBranches = useUpdateRegistrarMasterBranchMutation(props.type === "Edit" ? props.id : 0, props.mainRegistrarMasterId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            setSearch(data.pincode ? data.pincode.toString() : "");
            form.setValues({
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
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const registrarMasterBranchesMutateOptions:registrarMasterBranchesMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", registrarMasterId: props.mainRegistrarMasterId});
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
            await updateRegistrarMasterBranches.mutateAsync(form.values, registrarMasterBranchesMutateOptions);
        }else{
            await addRegistrarMasterBranches.mutateAsync(form.values, registrarMasterBranchesMutateOptions);
        }
    };

    const onSelectHandler = (value: string | null) => {
        form.setFieldValue('pincode', value ? Number(value) : undefined)
        if(pincodes){
            const pincodeSelectedData = pincodes.find((pincode) => pincode.pincode === value);
            if(pincodeSelectedData){
                form.setFieldValue('state', pincodeSelectedData.state_name);
            }
        }
    }

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput data-autofocus withAsterisk label="Branch" {...form.getInputProps('branch')} />
                    <TextInput label="Address" {...form.getInputProps('address')} />
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
                    <Select
                        label="Pincode"
                        placeholder="Type to search for pincode"
                        maxDropdownHeight={200}
                        data={pincodes ? pincodes.map((item) => ({label: item.pincode ? item.pincode : "", value: item.pincode ? item.pincode : ""})) : []}
                        searchable
                        clearable
                        nothingFoundMessage="Nothing found..."
                        disabled={isPincodeFetching || isPincodeLoading}
                        error={form.errors.pincode}
                        value={form.values.pincode ? form.values.pincode.toString() : undefined}
                        onChange={onSelectHandler}
                        onSearchChange={searchHandler}
                    />
                    <TextInput label="State" {...form.getInputProps('state')} />
                    <TextInput label="City" {...form.getInputProps('city')} />
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
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addRegistrarMasterBranches.isPending : updateRegistrarMasterBranches.isPending} disabled={props.type === "Create" ? addRegistrarMasterBranches.isPending : updateRegistrarMasterBranches.isPending} data-disabled={props.type === "Create" ? addRegistrarMasterBranches.isPending : updateRegistrarMasterBranches.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default RegistrarMasterBranchesForm