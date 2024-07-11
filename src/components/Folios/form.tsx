import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddFolioMutation, useFolioQuery, useUpdateFolioMutation } from "../../hooks/data/folios";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, FolioFormType, FolioType } from "../../utils/types";
import { FoliosListModalProps } from "../../pages/folios/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { DateInput } from "@mantine/dates";
import { numberInWords } from "../../utils/helper";


type FoliosFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type foliosMutateOptionsType = MutateOptions<FolioType, Error, FolioFormType, unknown>;

const FoliosForm:FC<FoliosFormProps & {mainShareCertificateMasterId: number, toggleModal: (value: FoliosListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useFolioQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addFolios = useAddFolioMutation(props.mainShareCertificateMasterId)
    const updateFolios = useUpdateFolioMutation(props.type === "Edit" ? props.id : 0, props.mainShareCertificateMasterId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                equityType: data.equityType ? data.equityType : undefined,
                Folio: data.Folio ? data.Folio : "",
                certificateNumber: data.certificateNumber ? data.certificateNumber : undefined,
                certificateSerialNumber: data.certificateSerialNumber ? data.certificateSerialNumber : undefined,
                shareholderName1: data.shareholderName1 ? data.shareholderName1 : undefined,
                shareholderName2: data.shareholderName2 ? data.shareholderName2 : undefined,
                shareholderName3: data.shareholderName3 ? data.shareholderName3 : undefined,
                faceValue: data.faceValue ? data.faceValue : undefined,
                noOfShares: data.noOfShares ? data.noOfShares : undefined,
                noOfSharesWords: data.noOfSharesWords ? data.noOfSharesWords : undefined,
                dateOfAllotment: (data  && data.dateOfAllotment) ? data.dateOfAllotment.toString() : undefined,
                distinctiveNosFrom: data.distinctiveNosFrom ? data.distinctiveNosFrom : undefined,
                distinctiveNosTo: data.distinctiveNosTo ? data.distinctiveNosTo : undefined,
            });
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
            const val = Number(form.values.distinctiveNosFrom) - Number(form.values.distinctiveNosTo);
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
                <SimpleGrid cols={{ base: 1, sm: 4 }} mt="md">
                    <Select
                        label="Equity Type"
                        withAsterisk
                        data={["Bonus", "Shares", "Splits", "Rights"]}
                        value={form.values.equityType ? form.values.equityType : null}
                        onChange={(value) => form.setFieldValue("equityType", value ? value as "Bonus" | "Shares" | "Splits" | "Rights" : "Bonus")}
                    />
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
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addFolios.isPending : updateFolios.isPending} disabled={props.type === "Create" ? addFolios.isPending : updateFolios.isPending} data-disabled={props.type === "Create" ? addFolios.isPending : updateFolios.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default FoliosForm