import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddCompanyMasterMutation, useUpdateCompanyMasterMutation, useCompanyMasterQuery } from "../../hooks/data/company_masters";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, CompanyMasterFormType, CompanyMasterType } from "../../utils/types";
import { useNameChangeMastersQuerySetData } from "../../hooks/data/name_change_masters";
import { CompanyMastersModalProps } from "../../pages/companyMasters/list";
import { SchemaType, initialValues, schema, transformValues } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { usePincodesSelectQuery } from "../../hooks/data/pincodes";
import debounce from "lodash.debounce";

type CompanyMasterFormProps = CompanyMastersModalProps;
type companyMasterMutateOptionsType = MutateOptions<CompanyMasterType, Error, CompanyMasterFormType, unknown>;

const CompanyMasterForm:FC<CompanyMasterFormProps & {toggleModal: (value: CompanyMastersModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const [search, setSearch] = useState<string>("");
    const {data, isFetching, isLoading, status, error, refetch} = useCompanyMasterQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const {data:pincodes, isFetching:isPincodeFetching, isLoading:isPincodeLoading} = usePincodesSelectQuery({search: search, enabled:props.status});
    const addCompanyMaster = useAddCompanyMasterMutation()
    const updateCompanyMaster = useUpdateCompanyMasterMutation(props.type === "Edit" ? props.id : 0)
    const { updateNameChangeMasters } = useNameChangeMastersQuerySetData();
    const searchHandler = debounce((value: string) => setSearch(value), 500);
    const form = useForm<SchemaType>({
        initialValues,
        transformValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            setSearch(data.pincode ? data.pincode.toString() : "");
            form.setValues({
                ISIN: data.ISIN ? data.ISIN : undefined,
                CIN: data.CIN ? data.CIN : undefined,
                newName: data.newName ? data.newName : undefined,
                currentName: data.currentName ? data.currentName : undefined,
                BSE: data.BSE ? data.BSE : undefined,
                NSE: data.NSE ? data.NSE : undefined,
                faceValue: data.faceValue ? data.faceValue : 0.0,
                closingPriceNSE: data.closingPriceNSE ? data.closingPriceNSE : 0.0,
                closingPriceBSE: data.closingPriceBSE ? data.closingPriceBSE : 0.0,
                registeredOffice: data.registeredOffice ? data.registeredOffice : undefined,
                city: data.city ? data.city : undefined,
                state: data.state ? data.state : undefined,
                pincode: data.pincode ? data.pincode : undefined,
                telephone: data.telephone ? data.telephone : undefined,
                fax: data.fax ? data.fax : undefined,
                email: data.email ? data.email : undefined,
                website: data.website ? data.website : undefined,
                nameContactPerson: data.nameContactPerson ? data.nameContactPerson : undefined,
                designationContactPerson: data.designationContactPerson ? data.designationContactPerson : undefined,
                emailContactPerson: data.emailContactPerson ? data.emailContactPerson : undefined,
                phoneContactPerson: data.phoneContactPerson ? data.phoneContactPerson : undefined,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const companyMasterMutateOptions:companyMasterMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({type: "Create", status: false});
                if(props.type === "Edit"){
                    updateNameChangeMasters((data && data.nameChangeMasterId) ? data.nameChangeMasterId : 0, data ? data.id : 0, {
                        id: (data && data.nameChangeMasterId) ? data.nameChangeMasterId : 0,
                        currentName: form.getTransformedValues().currentName,
                        BSE: form.getTransformedValues().BSE,
                        NSE: form.getTransformedValues().NSE,
                        companyId: (data && data.id) ? data.id : 0,
                        createdAt: new Date().toISOString(),
                    });
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
            await updateCompanyMaster.mutateAsync(form.getTransformedValues(), companyMasterMutateOptions);
        }else{
            await addCompanyMaster.mutateAsync(form.getTransformedValues(), companyMasterMutateOptions);
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
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={isLoading || isFetching} status={props.status && props.type==="Edit" ? status : "success"} error={error} hasPagination={false} refetch={refetch}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput withAsterisk label="Name of the Company (as per certificate)" {...form.getInputProps('newName')} />
                    <TextInput withAsterisk label="Current Name of the Company" {...form.getInputProps('currentName')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="NSE" {...form.getInputProps('NSE')} />
                    <TextInput label="BSE" {...form.getInputProps('BSE')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput withAsterisk data-autofocus label="ISIN" {...form.getInputProps('ISIN')} />
                    <TextInput label="CIN" {...form.getInputProps('CIN')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput withAsterisk label="Face Value" {...form.getInputProps('faceValue')} />
                    <TextInput withAsterisk label="Closing Price in NSE" {...form.getInputProps('closingPriceNSE')} />
                    <TextInput withAsterisk label="Closing Price in BSE" {...form.getInputProps('closingPriceBSE')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Telephone" {...form.getInputProps('telephone')} />
                    <TextInput label="Fax" {...form.getInputProps('fax')} />
                    <TextInput label="Registered Office" {...form.getInputProps('registeredOffice')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <Select
                        withAsterisk
                        data-autofocus
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
                    <TextInput label="Email" {...form.getInputProps('email')} />
                    <TextInput label="Website" {...form.getInputProps('website')} />
                    <TextInput label="Name of Contact Person" {...form.getInputProps('nameContactPerson')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Designation of Contact Person" {...form.getInputProps('designationContactPerson')} />
                    <TextInput label="Email of Contact Person" {...form.getInputProps('emailContactPerson')} />
                    <TextInput label="Phone of Contact Person" {...form.getInputProps('phoneContactPerson')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addCompanyMaster.isPending : updateCompanyMaster.isPending} disabled={props.type === "Create" ? addCompanyMaster.isPending : updateCompanyMaster.isPending} data-disabled={props.type === "Create" ? addCompanyMaster.isPending : updateCompanyMaster.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default CompanyMasterForm