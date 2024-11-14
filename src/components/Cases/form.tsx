import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Divider, FileInput, InputError, InputLabel, Select, SimpleGrid, TextInput, Title } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddCaseMutation, useCaseInfoQuery, useUpdateCaseMutation } from "../../hooks/data/cases";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, CaseFormType, CaseType } from "../../utils/types";
import { CasesListModalProps } from "../../pages/cases/list";
import { CaseType as CaseEnumType, SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { DateInput } from "@mantine/dates";
import { IconFileInfo } from "@tabler/icons-react";
import FolioSelect from "./folioSelect";
import ShareHolderMultiSelect from "./shareholderMultiSelect";
import LegalHeirMultiSelect from "./legalHeirSelect";
import ShareHolderSelect from "./shareholderSelect";


type CasesFormProps = {
    status: boolean;
    type: "Create",
    shareCertificateId: number;
    projectId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
    shareCertificateId: number;
    projectId: number;
}

type OptionType = {
 value: number;
 label: string;
};

type shareHolderMastersMutateOptionsType = MutateOptions<CaseType, Error, CaseFormType, unknown>;

const CasesForm: FC<CasesFormProps & { toggleModal: (value: CasesListModalProps) => void }> = (props) => {

    const { toastError } = useToast();
    const { data, isFetching, isLoading, status, error, refetch } = useCaseInfoQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id > 0));
    const addCases = useAddCaseMutation(props.shareCertificateId)
    const updateCases = useUpdateCaseMutation(props.type === "Edit" ? props.id : 0, (data && data.shareCertificateID) ? data.shareCertificateID.toString() : '')
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    const [folios, setFolios] = useState<OptionType[]>([]);
    const [claimants, selectClaimants] = useState<OptionType[]>([]);
    const [affidavits, selectAffidavits] = useState<OptionType[]>([]);
    const [order, setOrder] = useState<OptionType[]>([]);
    const [deadShareholder, setDeadShareholder] = useState<OptionType|undefined>(undefined);

    useEffect(() => {
        if (props.type === "Edit" && data && props.status) {
            form.setValues({
                caseType: data.caseType ? data.caseType as CaseEnumType : undefined,
                isDeceased: (data && (typeof data.isDeceased === "string")) ? data.isDeceased : "No",
                folios: (data && (typeof data.folios === "string")) ? data.folios : "",
                transpositionOrder: (data && (typeof data.transpositionOrder === "string")) ? data.transpositionOrder : "",
                shareholderNameDeath: (data && (typeof data.shareholderNameDeath === "string")) ? data.shareholderNameDeath : "",
                dod: (data && (typeof data.dod === "string") && data.dod !== "null") ? data.dod : "",
                isTestate: (data && (typeof data.isTestate === "string")) ? data.isTestate : "No",
                allowAffidavit: (data && (typeof data.allowAffidavit === "string")) ? data.allowAffidavit : "No",
                proofOfSucession: (data && (typeof data.proofOfSucession === "string")) ? data.proofOfSucession : "No",
                document: undefined,
                placeOfDeath: (data && (typeof data.placeOfDeath === "string") && data.placeOfDeath !== "null") ? data.placeOfDeath : "",
                dateOfDocument: (data && (typeof data.dateOfDocument === "string") && data.dateOfDocument !== "null") ? data.dateOfDocument : "",
                isMinor: (data && (typeof data.isMinor === "string")) ? data.isMinor : "No",
                dobMinor: (data && (typeof data.dobMinor === "string") && data.dobMinor !== "null") ? data.dobMinor : "",
                guardianName: (data && (typeof data.guardianName === "string") && data.guardianName !== "null") ? data.guardianName : "",
                guardianRelationship: (data && (typeof data.guardianRelationship === "string") && data.guardianRelationship !== "null") ? data.guardianRelationship : "",
                guardianPan: (data && (typeof data.guardianPan === "string")) ? data.guardianPan : "",
                deceasedRelationship: (data && (typeof data.deceasedRelationship === "string") && data.deceasedRelationship !== "null") ? data.deceasedRelationship : "",
                taxStatus: (data && (typeof data.taxStatus === "string")) ? data.taxStatus : "",
                selectClaimant: (data && (typeof data.selectClaimant === "string")) ? data.selectClaimant : "",
                selectAffidavit: (data && (typeof data.selectAffidavit === "string")) ? data.selectAffidavit : "",
                statusClaimant: (data && (typeof data.statusClaimant === "string")) ? data.statusClaimant : "",
                percentageClaimant: (data && (typeof data.percentageClaimant === "string") && data.percentageClaimant !== "null") ? data.percentageClaimant : "",
                occupationClaimant: (data && (typeof data.occupationClaimant === "string")) ? data.occupationClaimant : "",
                politicalExposureClaimant: (data && (typeof data.politicalExposureClaimant === "string")) ? data.politicalExposureClaimant : "",
                annualIncomeClaimant: (data && (typeof data.annualIncomeClaimant === "string")) ? data.annualIncomeClaimant : "",
                deadShareholderID: (data && (typeof data.deadShareholderID === "number")) ? data.deadShareholderID : undefined,
            });
            setFolios(data.folios ? (data.foliosSet.map((folio) => ({ value: folio.id, label: folio.Folio|| "" }))) : []);
            selectClaimants(data.selectClaimant ? (data.clamaints.map((shareHolder) => ({ value: shareHolder.id, label: shareHolder.namePan || "" }))) : []);
            setOrder(data.transpositionOrder ? (data.order.map((shareHolder) => ({ value: shareHolder.id, label: shareHolder.shareholderName || "" }))) : []);
            setDeadShareholder(data.deadShareholder ? { value: data.deadShareholder.id, label: data.deadShareholder.shareholderName || "" } : undefined);
            if(data.caseType.includes("Transmission")){
                selectAffidavits(data.selectAffidavit ? (data.affidavits.map((shareHolder) => ({ value: shareHolder.id, label: shareHolder.namePan || "" }))) : []);
            }else{
                selectAffidavits(data.selectAffidavit ? (data.affidavits.map((shareHolder) => ({ value: shareHolder.id, label: shareHolder.shareholderName || "" }))) : []);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);

    const onSubmit = async () => {
        const shareHolderMastersMutateOptions: shareHolderMastersMutateOptionsType = {
            onSuccess: () => {
                props.type === "Create" && form.reset();
                props.toggleModal({ status: false, type: "Create", shareCertificateId: props.shareCertificateId ?? '' });
            },
            onError: (error: Error) => {
                if (isAxiosError<AxiosErrorResponseType>(error)) {
                    if (error?.response?.data?.formErrors) {
                        for (const [key, value] of Object.entries(error?.response?.data?.formErrors)) {
                            form.setFieldError(key, value[0]);
                        }
                    } else if (error?.response?.data?.message) {
                        toastError(error.response.data.message);
                    }
                }
            }
        }

        if (props.type === "Edit") {
            await updateCases.mutateAsync(form.values as CaseFormType, shareHolderMastersMutateOptions);
        } else {
            await addCases.mutateAsync(form.values as CaseFormType, shareHolderMastersMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type === "Edit" ? (data ? true : false) : true} isLoading={props.status && props.type === "Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type === "Edit" ? status : "success"} error={props.status && props.type === "Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type === "Edit" ? refetch : () => { }}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Select
                        label="Case Type"
                        withAsterisk
                        data={Object.values(CaseEnumType)}
                        value={form.values.caseType ? form.values.caseType : null}
                        onChange={(value) => form.setFieldValue("caseType", value ? value as CaseEnumType : CaseEnumType.Claim)}
                    />
                    <div>
                        <InputLabel>Select Folio</InputLabel>
                        <FolioSelect 
                            shareCertificateMasterId={props.shareCertificateId} 
                            value={folios} 
                            setValue={(value) => {form.setFieldValue("folios", value.map((folio) => folio.value).join("_")); setFolios(value.map((folio) => folio))}} 
                        />
                        <InputError>{form.errors.folios}</InputError>
                    </div>
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <Select
                        label="Generate Affidavit"
                        data={["Yes", "No"]}
                        value={form.values.allowAffidavit ? form.values.allowAffidavit : null}
                        onChange={(value) => form.setFieldValue("allowAffidavit", value ? value : "No")}
                    />
                    {
                        form.values.allowAffidavit === "Yes" && <>
                        <div>
                            <InputLabel>Select Affidavit</InputLabel>
                            {
                                form.values.caseType.includes("Transmission") ? 
                                <LegalHeirMultiSelect 
                                    projectId={props.projectId} 
                                    value={affidavits} 
                                    setValue={(value) => {form.setFieldValue("selectAffidavit", value.map((folio) => folio.value).join("_")); selectAffidavits(value.map((folio) => folio))}}
                                /> :
                                <ShareHolderMultiSelect 
                                    projectId={props.projectId} 
                                    value={affidavits} 
                                    setValue={(value) => {form.setFieldValue("selectAffidavit", value.map((folio) => folio.value).join("_")); selectAffidavits(value.map((folio) => folio))}} 
                                />
                            }
                            <InputError>{form.errors.selectAffidavit}</InputError>
                        </div>
                        </> 
                    }
                </SimpleGrid>
                {form.values.caseType.includes("Transmission") && <>
                    <Divider
                        my="xs"
                        variant="dashed"
                        label={
                            <Title order={5}>Transmission</Title>
                        }
                        labelPosition="left"
                    />
                    <SimpleGrid cols={{ base: 1, sm: 1 }}>
                        <Select
                            label="Is soleholder deceased"
                            data={["Yes", "No"]}
                            value={form.values.isDeceased ? form.values.isDeceased : null}
                            onChange={(value) => form.setFieldValue("isDeceased", value ? value : "No")}
                        />
                    </SimpleGrid>
                    {form.values.isDeceased === "Yes" && <>
                        <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                            <TextInput label="Shareholder name as per Death Certificate" {...form.getInputProps('shareholderNameDeath')} />
                            <TextInput label="Relationship with Deceased" {...form.getInputProps('deceasedRelationship')} />
                            <DateInput
                                label="Date of Death"
                                value={form.values.dod ? new Date(form.values.dod) : undefined}
                                onChange={(value) => form.setFieldValue('dod', value?.toISOString() ? value.toISOString() : null)}
                            />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                            <Select
                                label="Testate/Intestate"
                                data={["Yes", "No"]}
                                value={form.values.isTestate ? form.values.isTestate : null}
                                onChange={(value) => form.setFieldValue("isTestate", value ? value : "No")}
                            />
                            <Select
                                label="Proof of sucession"
                                data={["Yes", "No"]}
                                value={form.values.proofOfSucession ? form.values.proofOfSucession : null}
                                onChange={(value) => form.setFieldValue("proofOfSucession", value ? value : "No")}
                            />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                            <FileInput
                                label="Document"
                                clearable
                                accept="image/png,image/jpeg,image/webp,image/jpg"
                                leftSection={<IconFileInfo size={16} />}
                                {...form.getInputProps('document')}
                            />
                            <DateInput
                                label="Date of document"
                                value={form.values.dateOfDocument ? new Date(form.values.dateOfDocument) : undefined}
                                onChange={(value) => form.setFieldValue('dateOfDocument', value?.toISOString() ? value.toISOString() : null)}
                            />
                        </SimpleGrid>
                    </>}
                    <SimpleGrid cols={{ base: 1, sm: 1 }} mt="md">
                        <Select
                            label="If claimant is minor"
                            data={["Yes", "No"]}
                            value={form.values.isMinor ? form.values.isMinor : null}
                            onChange={(value) => form.setFieldValue("isMinor", value ? value : "No")}
                        />
                    </SimpleGrid>
                    {form.values.isMinor === "Yes" && <>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                            <DateInput
                                label="DOB of Minor"
                                value={form.values.dobMinor ? new Date(form.values.dobMinor) : undefined}
                                onChange={(value) => form.setFieldValue('dobMinor', value?.toISOString() ? value.toISOString() : null)}
                            />
                            <TextInput label="Name of Guardian of minor" {...form.getInputProps('guardianName')} />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                            <TextInput label="Relationship of Guardian with Minor" {...form.getInputProps('guardianRelationship')} />
                            <TextInput label="PAN of Guardian" {...form.getInputProps('guardianPan')} />
                        </SimpleGrid>
                    </>}
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <Select
                            label="Tax Status"
                            data={["Resident Individual", "Resident Minor (through Guardian)", "NRI", "PIO"]}
                            value={form.values.taxStatus ? form.values.taxStatus : null}
                            onChange={(value) => form.setFieldValue("taxStatus", value ? value : "No")}
                        />
                        <div>
                            <InputLabel>Select Claimant</InputLabel>
                            <LegalHeirMultiSelect 
                                projectId={props.projectId} 
                                value={claimants} 
                                setValue={(value) => {form.setFieldValue("selectClaimant", value.map((folio) => folio.value).join("_")); selectClaimants(value.map((folio) => folio))}}
                            />
                            <InputError>{form.errors.selectClaimant}</InputError>
                        </div>
                        <Select
                            label="Claimant Status"
                            data={["Nominee", "Legal Heir", "Successor to the Estate of the deceased", "Administrator of the Estate of the deceased"]}
                            value={form.values.statusClaimant ? form.values.statusClaimant : null}
                            onChange={(value) => form.setFieldValue("statusClaimant", value ? value : "No")}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <TextInput label="Claimant Percentage" {...form.getInputProps('percentageClaimant')} />
                        <Select
                            label="Claimant Occupation"
                            data={["Private Sector Service", "Public Sector Service", "Government Service", "Business", "Professional Agriculturist", "Retired", "Home Maker", "Student", "Forex Dealer", "Others"]}
                            value={form.values.occupationClaimant ? form.values.occupationClaimant : null}
                            onChange={(value) => form.setFieldValue("occupationClaimant", value ? value : "No")}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <Select
                            label="Claimant Political Exposure"
                            data={["a Politically Exposed Person", "Related to a Politically Exposed Person", "Neither (Not applicable)"]}
                            value={form.values.politicalExposureClaimant ? form.values.politicalExposureClaimant : null}
                            onChange={(value) => form.setFieldValue("politicalExposureClaimant", value ? value : "No")}
                        />
                        <Select
                            label="Claimant Annual Income"
                            data={["Below 1 Lac", "1-5 Lacs", "5-10 Lacs", "10-25 Lacs", "25 Lacs-1crore", ">1 crore"]}
                            value={form.values.annualIncomeClaimant ? form.values.annualIncomeClaimant : null}
                            onChange={(value) => form.setFieldValue("annualIncomeClaimant", value ? value : "No")}
                        />
                    </SimpleGrid>
                </>}
                {form.values.caseType.includes("Transposition") && <>
                    <Divider
                        my="xs"
                        variant="dashed"
                        label={
                            <Title order={5}>Transposition</Title>
                        }
                        labelPosition="left"
                    />
                    <SimpleGrid cols={{ base: 1, sm: 1 }} mt="md">
                        <div>
                            <InputLabel>Select Transposition Order</InputLabel>
                            <ShareHolderMultiSelect 
                                projectId={props.projectId} 
                                value={order} 
                                setValue={(value) => {form.setFieldValue("transpositionOrder", value.map((folio) => folio.value).join("_")); setOrder(value.map((folio) => folio))}} 
                            />
                            <InputError>{form.errors.transpositionOrder}</InputError>
                        </div>
                    </SimpleGrid>
                </>}
                {form.values.caseType.includes("Deletion") && <>
                    <Divider
                        my="xs"
                        variant="dashed"
                        label={
                            <Title order={5}>Deletion</Title>
                        }
                        labelPosition="left"
                    />
                    <SimpleGrid cols={{ base: 1, sm: 1 }} mt="md">
                        <div>
                            <InputLabel>Select Deleted Shareholder</InputLabel>
                            <ShareHolderSelect 
                                projectId={props.projectId} 
                                value={deadShareholder} 
                                setValue={(value) => {form.setFieldValue("deadShareholderID", value.value); setDeadShareholder({...value})}} 
                            />
                            <InputError>{form.errors.deadShareholderID}</InputError>
                        </div>
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <TextInput label="Place Of Death" {...form.getInputProps('placeOfDeath')} />
                        <DateInput
                            label="Date of Death"
                            value={form.values.dod ? new Date(form.values.dod) : undefined}
                            onChange={(value) => form.setFieldValue('dod', value?.toISOString() ? value.toISOString() : null)}
                        />
                    </SimpleGrid>
                </>}
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addCases.isPending : updateCases.isPending} disabled={props.type === "Create" ? addCases.isPending : updateCases.isPending} data-disabled={props.type === "Create" ? addCases.isPending : updateCases.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default CasesForm