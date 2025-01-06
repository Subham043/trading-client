import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, InputError, InputLabel, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddFolioMutation, useFolioQuery, useUpdateFolioMutation } from "../../hooks/data/folios";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, FolioFormType, FolioType } from "../../utils/types";
import { FoliosListModalProps } from "../../pages/folios/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { DateInput } from "@mantine/dates";
import { numberInWords } from "../../utils/helper";
import ShareHolderSelect from "./shareholderSelect";

type OptionType = {
 value: number;
 label: string;
};

type ShareHolderSelectType = {
    shareholderName1: OptionType|undefined;
    shareholderName2: OptionType|undefined;
    shareholderName3: OptionType|undefined;
    endorsementShareholderName1: OptionType|undefined;
    endorsementShareholderName2: OptionType|undefined;
    endorsementShareholderName3: OptionType|undefined;
}

type FoliosFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type foliosMutateOptionsType = MutateOptions<FolioType, Error, FolioFormType, unknown>;

const FoliosForm:FC<FoliosFormProps & {mainShareCertificateMasterId: number, projectId: number, toggleModal: (value: FoliosListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useFolioQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addFolios = useAddFolioMutation(props.mainShareCertificateMasterId)
    const updateFolios = useUpdateFolioMutation(props.type === "Edit" ? props.id : 0, props.mainShareCertificateMasterId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    const [shareholderSelect, setShareholderSelect] = useState<ShareHolderSelectType>({
        shareholderName1: undefined,
        shareholderName2: undefined,
        shareholderName3: undefined,
        endorsementShareholderName1: undefined,
        endorsementShareholderName2: undefined,
        endorsementShareholderName3: undefined
    });
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                equityType: data.equityType ? data.equityType : undefined,
                Folio: data.Folio ? data.Folio : "",
                shareholderName1ID: data.shareholderName1ID ? data.shareholderName1ID : undefined,
                shareholderName2ID: data.shareholderName2ID ? data.shareholderName2ID : undefined,
                shareholderName3ID: data.shareholderName3ID ? data.shareholderName3ID : undefined,
                faceValue: data.faceValue ? data.faceValue : undefined,
                noOfShares: data.noOfShares ? data.noOfShares : undefined,
                noOfSharesWords: data.noOfSharesWords ? data.noOfSharesWords : undefined,
                dateOfAllotment: (data  && data.dateOfAllotment) ? data.dateOfAllotment.toString() : undefined,
                distinctiveNosFrom: data.distinctiveNosFrom ? data.distinctiveNosFrom : undefined,
                distinctiveNosTo: data.distinctiveNosTo ? data.distinctiveNosTo : undefined,
                endorsement: data.endorsement ? data.endorsement : undefined,
                endorsementFolio: data.endorsementFolio ? data.endorsementFolio : undefined,
                endorsementDate: (data  && data.endorsementDate) ? data.endorsementDate.toString() : undefined,
                endorsementShareholderName1ID: data.endorsementShareholderName1ID ? data.endorsementShareholderName1ID : undefined,
                endorsementShareholderName2ID: data.endorsementShareholderName2ID ? data.endorsementShareholderName2ID : undefined,
                endorsementShareholderName3ID: data.endorsementShareholderName3ID ? data.endorsementShareholderName3ID : undefined,
            });
            setShareholderSelect({
                shareholderName1: (typeof data.shareholderName1 !== "undefined" && data.shareholderName1) ? {value: data.shareholderName1.id, label: (data.shareholderName1.shareholderName||"")} : undefined,
                shareholderName2: (typeof data.shareholderName2 !== "undefined" && data.shareholderName2) ? {value: data.shareholderName2.id, label: (data.shareholderName2.shareholderName||"")} : undefined,
                shareholderName3: (typeof data.shareholderName3 !== "undefined" && data.shareholderName3) ? {value: data.shareholderName3.id, label: (data.shareholderName3.shareholderName||"")} : undefined,
                endorsementShareholderName1: (typeof data.endorsementShareholderName1 !== "undefined" && data.endorsementShareholderName1) ? {value: data.endorsementShareholderName1.id, label: (data.endorsementShareholderName1.shareholderName||"")} : undefined,
                endorsementShareholderName2: (typeof data.endorsementShareholderName2 !== "undefined" && data.endorsementShareholderName2) ? {value: data.endorsementShareholderName2.id, label: (data.endorsementShareholderName2.shareholderName||"")} : undefined,
                endorsementShareholderName3: (typeof data.endorsementShareholderName3 !== "undefined" && data.endorsementShareholderName3) ? {value: data.endorsementShareholderName3.id, label: (data.endorsementShareholderName3.shareholderName||"")} : undefined,
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);

    useEffect(() => {
        if(props.status && (form.values.noOfShares &&  form.values.noOfShares.length > 0)){
            const val = numberInWords(form.values.noOfShares);
            form.setFieldValue('noOfSharesWords', val);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.status, form.values.noOfShares]);

    useEffect(() => {
        if(props.status && (form.values.distinctiveNosFrom && form.values.distinctiveNosFrom.length > 0) && (form.values.distinctiveNosTo && form.values.distinctiveNosTo.length > 0) && !isNaN(Number(form.values.distinctiveNosFrom)) && !isNaN(Number(form.values.distinctiveNosTo))){
            const val = (Number(form.values.distinctiveNosTo) - Number(form.values.distinctiveNosFrom)) + 1;
            form.setFieldValue('noOfShares', val.toString());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.status, form.values.distinctiveNosFrom, form.values.distinctiveNosTo]);
    
    const onSubmit = async () => {
        const foliosMutateOptions:foliosMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", shareCertificateMasterId: props.mainShareCertificateMasterId});
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
            await updateFolios.mutateAsync(form.values as FolioFormType, foliosMutateOptions);
        }else{
            await addFolios.mutateAsync(form.values as FolioFormType, foliosMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Select
                        label="Equity Type"
                        withAsterisk
                        data={["Bonus", "Shares", "Splits", "Rights"]}
                        value={form.values.equityType ? form.values.equityType : null}
                        onChange={(value) => form.setFieldValue("equityType", value ? value as "Bonus" | "Shares" | "Splits" | "Rights" : "Bonus")}
                    />
                    <TextInput label="Folio" {...form.getInputProps('Folio')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <div>
                        <InputLabel>Shareholder Name 1</InputLabel>
                        <ShareHolderSelect 
                            projectId={props.projectId} 
                            value={shareholderSelect.shareholderName1} 
                            setValue={(value) => {form.setFieldValue("shareholderName1ID", value.value); setShareholderSelect({...shareholderSelect, shareholderName1: value})}} 
                        />
                        <InputError>{form.errors.shareholderName1ID}</InputError>
                    </div>
                    <div>
                        <InputLabel>Shareholder Name 2</InputLabel>
                        <ShareHolderSelect 
                            projectId={props.projectId} 
                            value={shareholderSelect.shareholderName2} 
                            setValue={(value) => {form.setFieldValue("shareholderName2ID", value.value); setShareholderSelect({...shareholderSelect, shareholderName2: value})}} 
                        />
                        <InputError>{form.errors.shareholderName2ID}</InputError>
                    </div>
                    <div>
                        <InputLabel>Shareholder Name 3</InputLabel>
                        <ShareHolderSelect 
                            projectId={props.projectId} 
                            value={shareholderSelect.shareholderName3}  
                            setValue={(value) => {form.setFieldValue("shareholderName3ID", value.value); setShareholderSelect({...shareholderSelect, shareholderName3: value})}} 
                        />
                        <InputError>{form.errors.shareholderName3ID}</InputError>
                    </div>
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Face Value" {...form.getInputProps('faceValue')} />
                    <TextInput label="Distinctive Nos From" {...form.getInputProps('distinctiveNosFrom')} />
                    <TextInput label="Distinctive Nos To" {...form.getInputProps('distinctiveNosTo')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="No. of Shares" {...form.getInputProps('noOfShares')} />
                    <TextInput label="No. of Shares in Words" {...form.getInputProps('noOfSharesWords')} />
                    <DateInput
                        value={form.values.dateOfAllotment ? new Date(form.values.dateOfAllotment) : undefined}
                        onChange={(value) => form.setFieldValue('dateOfAllotment', value?.toISOString())}
                        label="Date of Allotment"
                        placeholder="Date of Allotment"
                        valueFormat="DD/MM/YYYY"
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
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
                            valueFormat="DD/MM/YYYY"
                        />
                    </>}
                </SimpleGrid>
                {form.values.endorsement === "Yes" && <><SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <div>
                        <InputLabel>Endorsement Shareholder Name 1</InputLabel>
                        <ShareHolderSelect 
                            projectId={props.projectId} 
                            value={shareholderSelect.endorsementShareholderName1} 
                            setValue={(value) => {form.setFieldValue("endorsementShareholderName1ID", value.value); setShareholderSelect({...shareholderSelect, endorsementShareholderName1: value})}} 
                        />
                        <InputError>{form.errors.endorsementShareholderName1ID}</InputError>
                    </div>
                    <div>
                        <InputLabel>Endorsement Shareholder Name 2</InputLabel>
                        <ShareHolderSelect 
                            projectId={props.projectId} 
                            value={shareholderSelect.endorsementShareholderName2} 
                            setValue={(value) => {form.setFieldValue("endorsementShareholderName2ID", value.value); setShareholderSelect({...shareholderSelect, endorsementShareholderName2: value})}} 
                        />
                        <InputError>{form.errors.endorsementShareholderName2ID}</InputError>
                    </div>
                    <div>
                        <InputLabel>Endorsement Shareholder Name 3</InputLabel>
                        <ShareHolderSelect 
                            projectId={props.projectId} 
                            value={shareholderSelect.endorsementShareholderName3}
                            setValue={(value) => {form.setFieldValue("endorsementShareholderName3ID", value.value); setShareholderSelect({...shareholderSelect, endorsementShareholderName3: value})}} 
                        />
                        <InputError>{form.errors.endorsementShareholderName3ID}</InputError>
                    </div>
                </SimpleGrid></>}
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addFolios.isPending : updateFolios.isPending} disabled={props.type === "Create" ? addFolios.isPending : updateFolios.isPending} data-disabled={props.type === "Create" ? addFolios.isPending : updateFolios.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default FoliosForm