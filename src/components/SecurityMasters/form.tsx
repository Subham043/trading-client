import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddSecurityMasterMutation, useSecurityMasterQuery, useUpdateSecurityMasterMutation } from "../../hooks/data/security_masters";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, SecurityMasterFormType, SecurityMasterType } from "../../utils/types";
import { SecurityMastersListModalProps } from "../../pages/securityMasters/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import debounce from "lodash.debounce";
import { DateInput } from "@mantine/dates";
import { useCompanyMastersSelectQuery } from "../../hooks/data/company_masters";


type SecurityMastersFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type securityMastersMutateOptionsType = MutateOptions<SecurityMasterType, Error, SecurityMasterFormType, unknown>;

const SecurityMastersForm:FC<SecurityMastersFormProps & {toggleModal: (value: SecurityMastersListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const [search, setSearch] = useState<string>("");
    const searchHandler = debounce((value: string) => setSearch(value), 500);
    const {data:companyMasters, isFetching:isCompanyFetching, isLoading:isCompanyLoading} = useCompanyMastersSelectQuery({search: search, enabled:props.status});
    const {data, isFetching, isLoading, status, error,  refetch} = useSecurityMasterQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addSecurityMasters = useAddSecurityMasterMutation()
    const updateSecurityMasters = useUpdateSecurityMasterMutation(props.type === "Edit" ? props.id : 0)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            setSearch((data.companyMaster && data.companyMaster.currentNameChangeMasters && data.companyMaster.currentNameChangeMasters.currentName) ? data.companyMaster.currentNameChangeMasters.currentName.toString() : "");
            form.setValues({
                instrumentType: data.instrumentType ? data.instrumentType : undefined,
                equityType: data.equityType ? data.equityType : undefined,
                Folio: data.Folio ? data.Folio : undefined,
                certificateNumber: data.certificateNumber ? data.certificateNumber : undefined,
                certificateSerialNumber: data.certificateSerialNumber ? data.certificateSerialNumber : undefined,
                shareholderName1: data.shareholderName1 ? data.shareholderName1 : undefined,
                shareholderName2: data.shareholderName2 ? data.shareholderName2 : undefined,
                shareholderName3: data.shareholderName3 ? data.shareholderName3 : undefined,
                faceValue: data.faceValue ? data.faceValue : undefined,
                noOfShares: data.noOfShares ? data.noOfShares : undefined,
                noOfSharesWords: data.noOfSharesWords ? data.noOfSharesWords : undefined,
                dateOfAllotment: (data  && data.dateOfAllotment) ? data.dateOfAllotment.toString() : undefined,
                endorsement: data.endorsement ? data.endorsement : undefined,
                endorsementFolio: data.endorsementFolio ? data.endorsementFolio : undefined,
                endorsementDate: (data  && data.endorsementDate) ? data.endorsementDate.toString() : undefined,
                endorsementShareholderName1: data.endorsementShareholderName1 ? data.endorsementShareholderName1 : undefined,
                endorsementShareholderName2: data.endorsementShareholderName2 ? data.endorsementShareholderName2 : undefined,
                endorsementShareholderName3: data.endorsementShareholderName3 ? data.endorsementShareholderName3 : undefined,
                distinctiveNosFrom: data.distinctiveNosFrom ? data.distinctiveNosFrom : undefined,
                distinctiveNosTo: data.distinctiveNosTo ? data.distinctiveNosTo : undefined,
                companyID: data.companyID ? data.companyID : undefined,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const securityMastersMutateOptions:securityMastersMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create"});
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
            await updateSecurityMasters.mutateAsync(form.values as SecurityMasterFormType, securityMastersMutateOptions);
        }else{
            await addSecurityMasters.mutateAsync(form.values as SecurityMasterFormType, securityMastersMutateOptions);
        }
    };

    const onSelectHandler = (value: string | null) => {
        form.setFieldValue('companyID', value ? Number(value) : undefined)
        if(companyMasters){
            const companySelectedData = companyMasters.companyMaster.find((companyMaster) => companyMaster.id.toString() === value);
            if(companySelectedData){
                form.setFieldValue('state', companySelectedData.id);
            }
        }
    }

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    <Select
                        label="Instrument Type"
                        withAsterisk
                        data={["InvIT" , "IDR" , "MFs" , "PreferenceShares" , "REiT" , "Equity" , "Warrant"]}
                        value={form.values.instrumentType ? form.values.instrumentType : null}
                        onChange={(value) => form.setFieldValue("instrumentType", value ? value as "InvIT" | "IDR" | "MFs" | "PreferenceShares" | "REiT" | "Equity" | "Warrant" : "InvIT")}
                    />
                    <Select
                        label="Equity Type"
                        withAsterisk
                        data={["Bonus", "Shares", "Splits", "Rights"]}
                        value={form.values.equityType ? form.values.equityType : null}
                        onChange={(value) => form.setFieldValue("equityType", value ? value as "Bonus" | "Shares" | "Splits" | "Rights" : "Bonus")}
                    />
                    <Select
                        label="Company Name"
                        placeholder="Type to search for company"
                        maxDropdownHeight={200}
                        data={companyMasters ? companyMasters.companyMaster.map((item) => ({label: item.currentNameChangeMasters ? item.currentNameChangeMasters.currentName + " - " + item.id.toString() : item.id.toString(), value: item.id ? item.id.toString() : ""})) : []}
                        searchable
                        clearable
                        withAsterisk
                        nothingFoundMessage="Nothing found..."
                        disabled={isCompanyFetching || isCompanyLoading}
                        error={form.errors.companyID}
                        value={form.values.companyID ? form.values.companyID.toString() : undefined}
                        onChange={onSelectHandler}
                        onSearchChange={searchHandler}
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Folio" {...form.getInputProps('Folio')} />
                    <TextInput label="Certificate Number" {...form.getInputProps('certificateNumber')} />
                    <TextInput label="Certificate Serial Number" {...form.getInputProps('certificateSerialNumber')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Shareholder Name 1" {...form.getInputProps('shareholderName1')} />
                    <TextInput label="Shareholder Name 2" {...form.getInputProps('shareholderName2')} />
                    <TextInput label="Shareholder Name 3" {...form.getInputProps('shareholderName3')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Face Value" {...form.getInputProps('faceValue')} />
                    <TextInput label="No. of Shares" {...form.getInputProps('noOfShares')} />
                    <TextInput label="No. of Shares in Words" {...form.getInputProps('noOfSharesWords')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Distinctive Nos From" {...form.getInputProps('distinctiveNosFrom')} />
                    <TextInput label="Distinctive Nos To" {...form.getInputProps('distinctiveNosTo')} />
                    <DateInput
                        value={form.values.dateOfAllotment ? new Date(form.values.dateOfAllotment) : undefined}
                        onChange={(value) => form.setFieldValue('dateOfAllotment', value?.toISOString())}
                        label="Date of Allotment"
                        placeholder="Date of Allotment"
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: form.values.instrumentType !== "PreferenceShares" ? 3 : 2 }} mt="md">
                    <Select
                        label="Endorsement"
                        withAsterisk
                        data={["Yes", "No"]}
                        value={form.values.endorsement ? form.values.endorsement : null}
                        onChange={(value) => form.setFieldValue("endorsement", value ? value as "Yes" | "No" : "No")}
                    />
                    {form.values.endorsement === "Yes" && <>
                        <TextInput label="Endorsement Folio" {...form.getInputProps('endorsementFolio')} />
                        <DateInput
                            value={form.values.endorsementDate ? new Date(form.values.endorsementDate) : undefined}
                            onChange={(value) => form.setFieldValue('endorsementDate', value?.toISOString())}
                            label="Endorsement Date"
                            placeholder="Endorsement Date"
                        />
                    </>}
                </SimpleGrid>
                {form.values.endorsement === "Yes" && <><SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Endorsement Shareholder Name 1" {...form.getInputProps('endorsementShareholderName1')} />
                    <TextInput label="Endorsement Shareholder Name 2" {...form.getInputProps('endorsementShareholderName2')} />
                    <TextInput label="Endorsement Shareholder Name 3" {...form.getInputProps('endorsementShareholderName3')} />
                </SimpleGrid></>}
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addSecurityMasters.isPending : updateSecurityMasters.isPending} disabled={props.type === "Create" ? addSecurityMasters.isPending : updateSecurityMasters.isPending} data-disabled={props.type === "Create" ? addSecurityMasters.isPending : updateSecurityMasters.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default SecurityMastersForm