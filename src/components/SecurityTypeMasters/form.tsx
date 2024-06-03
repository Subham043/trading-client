import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddSecurityTypeMasterMutation, useSecurityTypeMasterQuery, useUpdateSecurityTypeMasterMutation } from "../../hooks/data/security_type_masters";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, SecurityTypeMasterFormType, SecurityTypeMasterType } from "../../utils/types";
import { SecurityTypeMastersListModalProps } from "../../pages/securityTypeMasters/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import debounce from "lodash.debounce";
import { DateInput } from "@mantine/dates";
import { useCompanyMastersSelectQuery } from "../../hooks/data/company_masters";


type SecurityTypeMastersFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type securityTypeMastersMutateOptionsType = MutateOptions<SecurityTypeMasterType, Error, SecurityTypeMasterFormType, unknown>;

const SecurityTypeMastersForm:FC<SecurityTypeMastersFormProps & {toggleModal: (value: SecurityTypeMastersListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const [search, setSearch] = useState<string>("");
    const searchHandler = debounce((value: string) => setSearch(value), 500);
    const {data:companyMasters, isFetching:isCompanyFetching, isLoading:isCompanyLoading} = useCompanyMastersSelectQuery({search: search, enabled:props.status});
    const {data, isFetching, isLoading, status, error,  refetch} = useSecurityTypeMasterQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addSecurityTypeMasters = useAddSecurityTypeMasterMutation()
    const updateSecurityTypeMasters = useUpdateSecurityTypeMasterMutation(props.type === "Edit" ? props.id : 0)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            setSearch((data.companyMaster && data.companyMaster.currentNameChangeMasters && data.companyMaster.currentNameChangeMasters.currentName) ? data.companyMaster.currentNameChangeMasters.currentName.toString() : "");
            form.setValues({
                instrumentType: data.instrumentType ? data.instrumentType : undefined,
                Symbol: data.Symbol ? data.Symbol : undefined,
                Series: data.Series ? data.Series : undefined,
                securityName: data.securityName ? data.securityName : undefined,
                faceValue: data.faceValue ? data.faceValue : undefined,
                paidUpValue: data.paidUpValue ? data.paidUpValue : undefined,
                dividend: data.dividend ? data.dividend : undefined,
                redemptionAmount: data.redemptionAmount ? data.redemptionAmount : undefined,
                conversionAmount: data.conversionAmount ? data.conversionAmount : undefined,
                marketLot: data.marketLot ? data.marketLot : undefined,
                isinNumber: data.isinNumber ? data.isinNumber : undefined,
                distinctiveNosFrom: data.distinctiveNosFrom ? data.distinctiveNosFrom : undefined,
                distinctiveNosTo: data.distinctiveNosTo ? data.distinctiveNosTo : undefined,
                companyID: data.companyID ? data.companyID : undefined,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const securityTypeMastersMutateOptions:securityTypeMastersMutateOptionsType = {
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
            await updateSecurityTypeMasters.mutateAsync(form.values as SecurityTypeMasterFormType, securityTypeMastersMutateOptions);
        }else{
            await addSecurityTypeMasters.mutateAsync(form.values as SecurityTypeMasterFormType, securityTypeMastersMutateOptions);
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
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Select
                        label="Instrument Type"
                        withAsterisk
                        data={["InvIT" , "IDR" , "MFs" , "PreferenceShares" , "REiT" , "Equity" , "Warrant"]}
                        value={form.values.instrumentType ? form.values.instrumentType : null}
                        onChange={(value) => form.setFieldValue("instrumentType", value ? value as "InvIT" | "IDR" | "MFs" | "PreferenceShares" | "REiT" | "Equity" | "Warrant" : "InvIT")}
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
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Symbol" {...form.getInputProps('Symbol')} />
                    <TextInput label="Series" {...form.getInputProps('Series')} />
                </SimpleGrid>
                {form.values.instrumentType !== "Warrant" && <SimpleGrid cols={{ base: 1, sm: form.values.instrumentType !== "PreferenceShares" ? 3 : 2 }} mt="md">
                    <TextInput label="Paid Up Value" {...form.getInputProps('paidUpValue')} />
                    <TextInput label="Face Value" {...form.getInputProps('faceValue')} />
                    {form.values.instrumentType !== "PreferenceShares" && <TextInput label="ISIN Number" {...form.getInputProps('isinNumber')} />}
                </SimpleGrid>}
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Market Lot" {...form.getInputProps('marketLot')} />
                    <DateInput
                        value={form.values.dateOfListing ? new Date(form.values.dateOfListing) : undefined}
                        onChange={(value) => form.setFieldValue('dateOfListing', value?.toISOString())}
                        label="Date of Listing"
                        placeholder="Date of Listing"
                    />
                </SimpleGrid>
                {form.values.instrumentType === "PreferenceShares" && <><SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <DateInput
                        value={form.values.dateOfAllotment ? new Date(form.values.dateOfAllotment) : undefined}
                        onChange={(value) => form.setFieldValue('dateOfAllotment', value?.toISOString())}
                        label="Date of Allotment"
                        placeholder="Date of Allotment"
                    />
                    <TextInput label="Dividend" {...form.getInputProps('dividend')} />
                    <TextInput label="Security Name" {...form.getInputProps('securityName')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Redemption Amount" {...form.getInputProps('redemptionAmount')} />
                    <DateInput
                        value={form.values.redemptionDate ? new Date(form.values.redemptionDate) : undefined}
                        onChange={(value) => form.setFieldValue('redemptionDate', value?.toISOString())}
                        label="Redemption Date"
                        placeholder="Redemption Date"
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Conversion Amount" {...form.getInputProps('conversionAmount')} />
                    <DateInput
                        value={form.values.conversionDate ? new Date(form.values.conversionDate) : undefined}
                        onChange={(value) => form.setFieldValue('conversionDate', value?.toISOString())}
                        label="Conversion Date"
                        placeholder="Conversion Date"
                    />
                </SimpleGrid></>}
                {form.values.instrumentType === "Warrant" && <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Distinctive Nos From" {...form.getInputProps('distinctiveNosFrom')} />
                    <TextInput label="Distinctive Nos To" {...form.getInputProps('distinctiveNosTo')} />
                </SimpleGrid>}
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addSecurityTypeMasters.isPending : updateSecurityTypeMasters.isPending} disabled={props.type === "Create" ? addSecurityTypeMasters.isPending : updateSecurityTypeMasters.isPending} data-disabled={props.type === "Create" ? addSecurityTypeMasters.isPending : updateSecurityTypeMasters.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default SecurityTypeMastersForm