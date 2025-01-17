import { FC, useEffect, useMemo } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, InputError, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddCertificateMutation, useCertificateQuery, useUpdateCertificateMutation } from "../../hooks/data/certificates";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, CertificateFormType, CertificateType, ShareHolderDetailType } from "../../utils/types";
import { CertificatesListModalProps } from "../../pages/certificates/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { numberInWords } from "../../utils/helper";
import { DateInput } from "@mantine/dates";

type CertificatesFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type certificatesMutateOptionsType = MutateOptions<CertificateType, Error, CertificateFormType, unknown>;

type Props = CertificatesFormProps & {
    mainFolioId: number;
    toggleModal: (value: CertificatesListModalProps) => void;
    shareHolder1?: ShareHolderDetailType | null | undefined;
    shareHolder2?: ShareHolderDetailType | null | undefined;
    shareHolder3?: ShareHolderDetailType | null | undefined;
}

const CertificatesForm:FC<Props> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useCertificateQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addCertificates = useAddCertificateMutation(props.mainFolioId)
    const updateCertificates = useUpdateCertificateMutation(props.type === "Edit" ? props.id : 0, props.mainFolioId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });

    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                certificateNumber: data.certificateNumber ? data.certificateNumber : undefined,
                certificateSerialNumber: data.certificateSerialNumber ? data.certificateSerialNumber : undefined,
                equityType: data.equityType ? data.equityType : undefined,
                faceValue: data.faceValue ? data.faceValue : undefined,
                shareholderName1Txt: data.shareholderName1Txt ? data.shareholderName1Txt : undefined,
                shareholderName2Txt: data.shareholderName2Txt ? data.shareholderName2Txt : undefined,
                shareholderName3Txt: data.shareholderName3Txt ? data.shareholderName3Txt : undefined,
                noOfShares: data.noOfShares ? data.noOfShares : undefined,
                noOfSharesWords: data.noOfSharesWords ? data.noOfSharesWords : undefined,
                dateOfAllotment: (data  && data.dateOfAllotment) ? data.dateOfAllotment.toString() : undefined,
                dateOfAction: (data  && data.dateOfAction) ? data.dateOfAction.toString() : undefined,
                distinctiveNosFrom: data.distinctiveNosFrom ? data.distinctiveNosFrom : undefined,
                distinctiveNosTo: data.distinctiveNosTo ? data.distinctiveNosTo : undefined,
                endorsement: data.endorsement ? data.endorsement : undefined,
                endorsementFolio: data.endorsementFolio ? data.endorsementFolio : undefined,
                endorsementDate: (data  && data.endorsementDate) ? data.endorsementDate.toString() : undefined,
                endorsementShareholderName1ID: data.endorsementShareholderName1ID ? data.endorsementShareholderName1ID : undefined,
                endorsementShareholderName2ID: data.endorsementShareholderName2ID ? data.endorsementShareholderName2ID : undefined,
                endorsementShareholderName3ID: data.endorsementShareholderName3ID ? data.endorsementShareholderName3ID : undefined,
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
            const val = (Number(form.values.distinctiveNosTo) - Number(form.values.distinctiveNosFrom)) + 1;
            form.setFieldValue('noOfShares', val.toString());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.status, form.values.distinctiveNosFrom, form.values.distinctiveNosTo]);

    const onSubmit = async () => {
        const certificatesMutateOptions:certificatesMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", folioId: props.mainFolioId});
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
            await updateCertificates.mutateAsync(form.values as CertificateFormType, certificatesMutateOptions);
        }else{
            await addCertificates.mutateAsync(form.values as CertificateFormType, certificatesMutateOptions);
        }
    };

    const shareHolderOptions:{label:string, value:string}[] = useMemo(()=>{
        const options: {label:string, value:string}[] = [];
        if(props.shareHolder1){
            options.push({
                label: props.shareHolder1.shareholderName ?? "Share Holder Name 1",
                value: props.shareHolder1.id.toString()
            })
        }
        if(props.shareHolder2){
            options.push({
                label: props.shareHolder2.shareholderName ?? "Share Holder Name 2",
                value: props.shareHolder2.id.toString()
            })
        }
        if(props.shareHolder3){
            options.push({
                label: props.shareHolder3.shareholderName ?? "Share Holder Name 3",
                value: props.shareHolder3.id.toString()
            })
        }
        return options.filter((obj, index, self) => 
            self.findIndex(o => o.value === obj.value) === index
        );
    }, [props.shareHolder1, props.shareHolder2, props.shareHolder3])

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Select
                        label="Equity Type"
                        withAsterisk
                        data={["Bonus", "ShareBought", "Equity", "Splits", "Rights"]}
                        value={form.values.equityType ? form.values.equityType : null}
                        onChange={(value) => form.setFieldValue("equityType", value ? value as "Equity" | "ShareBought" | "Bonus" | "Splits" | "Rights" : "Equity")}
                        error={form.errors.equityType}
                    />
                    <TextInput label="Face Value" {...form.getInputProps('faceValue')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Certificate Number" {...form.getInputProps('certificateNumber')} />
                    <TextInput label="Certificate Serial Number" {...form.getInputProps('certificateSerialNumber')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <div>
                        <TextInput label="Share Holder Name 1" {...form.getInputProps('shareholderName1Txt')} />
                        {(form.values.shareholderName1Txt!==undefined && form.values.shareholderName1Txt.length>0) && <>
                            <InputError>{form.values.shareholderName1Txt!==props.shareHolder1?.shareholderName ? "Share Holder Name does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName1Txt!==props.shareHolder1?.nameAadhar ? "Name as per aadhar does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName1Txt!==props.shareHolder1?.namePan ? "Name as per Pan does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName1Txt!==props.shareHolder1?.nameCml ? "Name as per CML does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName1Txt!==props.shareHolder1?.nameBank ? "Name as per bank does not match" : null}</InputError>
                        </>}
                    </div>
                    <div>
                        <TextInput label="Share Holder Name 2" {...form.getInputProps('shareholderName2Txt')} />
                        {(form.values.shareholderName2Txt!==undefined && form.values.shareholderName2Txt.length>0) && <>
                            <InputError>{form.values.shareholderName2Txt!==props.shareHolder2?.shareholderName ? "Share Holder Name does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName2Txt!==props.shareHolder2?.nameAadhar ? "Name as per aadhar does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName2Txt!==props.shareHolder2?.namePan ? "Name as per Pan does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName2Txt!==props.shareHolder2?.nameCml ? "Name as per CML does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName2Txt!==props.shareHolder2?.nameBank ? "Name as per bank does not match" : null}</InputError>
                        </>}
                    </div>
                    <div>
                        <TextInput label="Share Holder Name 3" {...form.getInputProps('shareholderName3Txt')} />
                        {(form.values.shareholderName3Txt!==undefined && form.values.shareholderName3Txt.length>0) && <>
                            <InputError>{form.values.shareholderName3Txt!==props.shareHolder3?.shareholderName ? "Share Holder Name does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName3Txt!==props.shareHolder3?.nameAadhar ? "Name as per aadhar does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName3Txt!==props.shareHolder3?.namePan ? "Name as per Pan does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName3Txt!==props.shareHolder3?.nameCml ? "Name as per CML does not match" : null}</InputError>
                            <InputError>{form.values.shareholderName3Txt!==props.shareHolder3?.nameBank ? "Name as per bank does not match" : null}</InputError>
                        </>}
                    </div>
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Distinctive Nos From" {...form.getInputProps('distinctiveNosFrom')} />
                    <TextInput label="Distinctive Nos To" {...form.getInputProps('distinctiveNosTo')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="No. of Shares" {...form.getInputProps('noOfShares')} />
                    <TextInput label="No. of Shares in Words" {...form.getInputProps('noOfSharesWords')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <DateInput
                        value={form.values.dateOfAction ? new Date(form.values.dateOfAction) : undefined}
                        onChange={(value) => form.setFieldValue('dateOfAction', value?.toISOString())}
                        label="Date of Action"
                        placeholder="Date of Action"
                        valueFormat="DD/MM/YYYY"
                        error={form.errors.dateOfAction}
                    />
                    <DateInput
                        value={form.values.dateOfAllotment ? new Date(form.values.dateOfAllotment) : undefined}
                        onChange={(value) => form.setFieldValue('dateOfAllotment', value?.toISOString())}
                        label="Date of Allotment"
                        placeholder="Date of Allotment"
                        valueFormat="DD/MM/YYYY"
                        error={form.errors.dateOfAllotment}
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <Select
                        label="Endorsement"
                        withAsterisk
                        data={["Yes", "No"]}
                        value={form.values.endorsement ? form.values.endorsement : null}
                        onChange={(value) => form.setFieldValue("endorsement", value ? value as "Yes" | "No" : "No")}
                        error={form.errors.endorsement}
                    />
                    {form.values.endorsement === "Yes" && <>
                        <TextInput label="Endorsement Folio" {...form.getInputProps('endorsementFolio')} />
                        <DateInput
                            value={form.values.endorsementDate ? new Date(form.values.endorsementDate) : undefined}
                            onChange={(value) => form.setFieldValue('endorsementDate', value?.toISOString())}
                            label="Endorsement Date"
                            placeholder="Endorsement Date"
                            valueFormat="DD/MM/YYYY"
                            error={form.errors.endorsementDate}
                        />
                    </>}
                </SimpleGrid>
                {form.values.endorsement === "Yes" && <><SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <div>
                        <Select
                            label="Endorsement Shareholder Name 1"
                            placeholder="Select endorsement Shareholder Name 1"
                            maxDropdownHeight={200}
                            data={shareHolderOptions}
                            searchable={false}
                            clearable
                            nothingFoundMessage="Nothing found..."
                            error={form.errors.endorsementShareholderName1ID}
                            value={form.values.endorsementShareholderName1ID ? form.values.endorsementShareholderName1ID.toString() : undefined}
                            onChange={(value) => {form.setFieldValue("endorsementShareholderName1ID", Number(value))}}
                        />
                    </div>
                    <div>
                        <Select
                            label="Endorsement Shareholder Name 2"
                            placeholder="Select endorsement Shareholder Name 2"
                            maxDropdownHeight={200}
                            data={shareHolderOptions}
                            searchable={false}
                            clearable
                            nothingFoundMessage="Nothing found..."
                            error={form.errors.endorsementShareholderName2ID}
                            value={form.values.endorsementShareholderName2ID ? form.values.endorsementShareholderName2ID.toString() : undefined}
                            onChange={(value) => {form.setFieldValue("endorsementShareholderName2ID", Number(value))}}
                        />
                    </div>
                    <div>
                        <Select
                            label="Endorsement Shareholder Name 3"
                            placeholder="Select endorsement Shareholder Name 3"
                            maxDropdownHeight={200}
                            data={shareHolderOptions}
                            searchable={false}
                            clearable
                            nothingFoundMessage="Nothing found..."
                            error={form.errors.endorsementShareholderName3ID}
                            value={form.values.endorsementShareholderName3ID ? form.values.endorsementShareholderName3ID.toString() : undefined}
                            onChange={(value) => {form.setFieldValue("endorsementShareholderName3ID", Number(value))}}
                        />
                    </div>
                </SimpleGrid></>}
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addCertificates.isPending : updateCertificates.isPending} disabled={props.type === "Create" ? addCertificates.isPending : updateCertificates.isPending} data-disabled={props.type === "Create" ? addCertificates.isPending : updateCertificates.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default CertificatesForm