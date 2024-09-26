import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Divider, FileInput, Select, SimpleGrid, TextInput, Title } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddShareHolderDetailMutation, useShareHolderDetailQuery, useUpdateShareHolderDetailMutation } from "../../hooks/data/share_holder_details";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, ShareHolderDetailFormType, ShareHolderDetailType, ShareHolderMasterType } from "../../utils/types";
import { ShareHolderDetailsListModalProps } from "../../pages/shareHolderDetails/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { DateInput } from "@mantine/dates";


type ShareHolderDetailsFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type foliosMutateOptionsType = MutateOptions<ShareHolderDetailType, Error, ShareHolderDetailFormType, unknown>;

const ShareHolderDetailsForm:FC<ShareHolderDetailsFormProps & {mainShareHolderMasterId: number, shareHolderMasterData: ShareHolderMasterType, toggleModal: (value: ShareHolderDetailsListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useShareHolderDetailQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addShareHolderDetails = useAddShareHolderDetailMutation(props.mainShareHolderMasterId)
    const updateShareHolderDetails = useUpdateShareHolderDetailMutation(props.type === "Edit" ? props.id : 0, props.mainShareHolderMasterId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                shareholderName: (data && data.shareholderName) ? data.shareholderName : "",
                shareholderNamePan: (data && data.shareholderNamePan) ? data.shareholderNamePan : "",
                shareholderNameAadhar: (data && data.shareholderNameAadhar) ? data.shareholderNameAadhar : "",
                shareholderNameCertificate: (data && data.shareholderNameCertificate) ? data.shareholderNameCertificate : "",
                shareholderNameCml: (data && data.shareholderNameCml) ? data.shareholderNameCml : "",
                namePan: (data && data.namePan) ? data.namePan : "",
                nameAadhar: (data && data.nameAadhar) ? data.nameAadhar : "",
                nameCml: (data && data.nameCml) ? data.nameCml : "",
                phone: (data && data.phone) ? data.phone : "",
                email: (data && data.email) ? data.email : "",
                aadhar: (data && data.aadhar) ? data.aadhar : "",
                pan: (data && data.pan) ? data.pan : "",
                dob: (data && data.dob) ? data.dob : "",
                age: (data && data.age) ? data.age : "",
                nationality: (data && data.nationality) ? data.nationality : "",
                placeOfBirth: (data && data.placeOfBirth) ? data.placeOfBirth : "",
                city: (data && data.city) ? data.city : "",
                state: (data && data.state) ? data.state : "",
                countryOfBirth: (data && data.countryOfBirth) ? data.countryOfBirth : "",
                DPID: (data && data.DPID) ? data.DPID : "",
                dematAccountNo: (data && data.dematAccountNo) ? data.dematAccountNo : "",
                nameBank: (data && data.nameBank) ? data.nameBank : "",
                bankName: (data && data.bankName) ? data.bankName : "",
                bankAddress: (data && data.bankAddress) ? data.bankAddress : "",
                bankEmail: (data && data.bankEmail) ? data.bankEmail : "",
                bankPhone: (data && data.bankPhone) ? data.bankPhone : "",
                bankMICR: (data && data.bankMICR) ? data.bankMICR : "",
                bankIFS: (data && data.bankIFS) ? data.bankIFS : "",
                bankAccountNo: (data && data.bankAccountNo) ? data.bankAccountNo : "",
                bankAccountType: (data && data.bankAccountType) ? data.bankAccountType : "",
                addressBank: (data && data.addressBank) ? data.addressBank : "",
                emailBank: (data && data.emailBank) ? data.emailBank : "",
                phoneBank: (data && data.phoneBank) ? data.phoneBank : "",
                pincodeBank: (data && data.pincodeBank) ? data.pincodeBank : "",
                isDeceased: (data && data.isDeceased) ? data.isDeceased : "",
                shareholderNameDeath: (data && data.shareholderNameDeath) ? data.shareholderNameDeath : "",
                dod: (data && data.dod) ? data.dod : "",
                isTestate: (data && data.isTestate) ? data.isTestate : "",
                proofOfSucession: (data && data.proofOfSucession) ? data.proofOfSucession : "",
                document: (data && data.document) ? data.document : "",
                dateOfDocument: (data && data.dateOfDocument) ? data.dateOfDocument : "",
                isMinor: (data && data.isMinor) ? data.isMinor : "",
                dobMinor: (data && data.dobMinor) ? data.dobMinor : "",
                guardianName: (data && data.guardianName) ? data.guardianName : "",
                guardianRelationship: (data && data.guardianRelationship) ? data.guardianRelationship : "",
                guardianPan: (data && data.guardianPan) ? data.guardianPan : "",
                deceasedRelationship: (data && data.deceasedRelationship) ? data.deceasedRelationship : "",
                taxStatus: (data && data.taxStatus) ? data.taxStatus : "",
                selectClaimant: (data && data.selectClaimant) ? data.selectClaimant : "",
                statusClaimant: (data && data.statusClaimant) ? data.statusClaimant : "",
                percentageClaimant: (data && data.percentageClaimant) ? data.percentageClaimant : "",
                occupationClaimant: (data && data.occupationClaimant) ? data.occupationClaimant : "",
                politicalExposureClaimant: (data && data.politicalExposureClaimant) ? data.politicalExposureClaimant : "",
                annualIncomeClaimant: (data && data.annualIncomeClaimant) ? data.annualIncomeClaimant : "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const foliosMutateOptions:foliosMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", shareHolderMasterId: props.mainShareHolderMasterId});
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
            await updateShareHolderDetails.mutateAsync(form.values as ShareHolderDetailFormType, foliosMutateOptions);
        }else{
            await addShareHolderDetails.mutateAsync(form.values as ShareHolderDetailFormType, foliosMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    <TextInput label="Name as per PAN" {...form.getInputProps('namePan')} />
                    <TextInput label="Name as per Aadhaar" {...form.getInputProps('nameAadhar')} />
                    <TextInput label="Name as per CML" {...form.getInputProps('nameCml')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client Contact Phone Number" {...form.getInputProps('phone')} />
                    <TextInput label="Client Contact Email address" {...form.getInputProps('email')} />
                    <TextInput label="Client Aadhaar Number (if applicable)" {...form.getInputProps('aadhaar')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client PAN (Permanent Account Number)" {...form.getInputProps('pan')} />
                    <DateInput label="Client Date of Birth (if applicable)" {...form.getInputProps('dob')} />
                    <TextInput label="Client Age" {...form.getInputProps('age')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client nationality" {...form.getInputProps('nationality')} />
                    <TextInput label="Client Place of Birth" {...form.getInputProps('placeOfBirth')} />
                    <TextInput label="Client City" {...form.getInputProps('city')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client State" {...form.getInputProps('state')} />
                    <TextInput label="Client country of birth" {...form.getInputProps('countryOfBirth')} />
                    <TextInput label="Client DP ID" {...form.getInputProps('DPID')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client name as per Bank account" {...form.getInputProps('nameBank')} />
                    <TextInput label="Client Bank name" {...form.getInputProps('bankName')} />
                    <TextInput label="Client Bank address" {...form.getInputProps('bankAddress')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client Bank Email ID" {...form.getInputProps('bankEmail')} />
                    <TextInput label="Client Bank Phone number" {...form.getInputProps('bankPhone')} />
                    <TextInput label="Client Bank account MICR code" {...form.getInputProps('bankMICR')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client Bank account IFS code" {...form.getInputProps('bankIFS')} />
                    <TextInput label="Client Bank Account Number" {...form.getInputProps('bankAccountNo')} />
                    <TextInput label="Client Bank account type" {...form.getInputProps('bankAccountType')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client address as per Bank" {...form.getInputProps('addressBank')} />
                    <TextInput label="Client Email ID as per Bank" {...form.getInputProps('emailBank')} />
                    <TextInput label="Client Phone number as per Bank" {...form.getInputProps('phoneBank')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client address PIN code" {...form.getInputProps('pincodeBank')} />
                </SimpleGrid>
                {props.shareHolderMasterData.caseType.includes("ClaimSuspense") && <>
                    <Divider 
                        my="xs" 
                        variant="dashed"
                        label={
                            <Title order={5}>Claim / Suspense</Title>
                        } 
                        labelPosition="left"
                    />
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <TextInput label="Share Holder Name" {...form.getInputProps('shareholderName')} />
                        <TextInput label="Share Holder Name as per Certificate" {...form.getInputProps('shareholderNameCertificate')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <TextInput label="Share Holder Name as per PAN" {...form.getInputProps('shareholderNamePan')} />
                        <TextInput label="Share Holder Name as per Aadhaar" {...form.getInputProps('shareholderNameAadhar')} />
                        <TextInput label="Share Holder Name as per CML" {...form.getInputProps('shareholderNameCml')} />
                    </SimpleGrid>
                </>}
                {props.shareHolderMasterData.caseType.includes("Transmission") && <>
                    <Divider 
                        my="xs" 
                        variant="dashed"
                        label={
                            <Title order={5}>Transmission</Title>
                        } 
                        labelPosition="left"
                    />
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <Select
                            label="Is soleholder deceased"
                            data={["Yes" , "No"]}
                            value={form.values.isDeceased ? form.values.isDeceased : null}
                            onChange={(value) => form.setFieldValue("isDeceased", value ? value : "No")}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <TextInput label="Shareholder name as per Death Certificate" {...form.getInputProps('shareholderNameDeath')} />
                        <TextInput label="Date of Death" {...form.getInputProps('dod')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <Select
                            label="Testate/Intestate"
                            data={["Yes" , "No"]}
                            value={form.values.isTestate ? form.values.isTestate : null}
                            onChange={(value) => form.setFieldValue("isTestate", value ? value : "No")}
                        />
                        <Select
                            label="Proof of sucession"
                            data={["Yes" , "No"]}
                            value={form.values.proofOfSucession ? form.values.proofOfSucession : null}
                            onChange={(value) => form.setFieldValue("proofOfSucession", value ? value : "No")}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <Select
                            label="If claimant is minor"
                            data={["Yes" , "No"]}
                            value={form.values.isMinor ? form.values.isMinor : null}
                            onChange={(value) => form.setFieldValue("isMinor", value ? value : "No")}
                        />
                        <TextInput label="DOB of Minor" {...form.getInputProps('dobMinor')} />
                        <TextInput label="Name of Guardian of minor" {...form.getInputProps('guardianName')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <TextInput label="Relationship of Guardian with Minor" {...form.getInputProps('guardianRelationship')} />
                        <TextInput label="PAN of Guardian" {...form.getInputProps('guardianPan')} />
                        <TextInput label="Relationship with Deceased" {...form.getInputProps('deceasedRelationship')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <FileInput label="Document" {...form.getInputProps('document')} />
                        <TextInput label="Date of document" {...form.getInputProps('dateOfDocument')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <Select
                            label="Tax Status"
                            data={["Resident Individual" , "Resident Minor (through Guardian)", "NRI", "PIO"]}
                            value={form.values.taxStatus ? form.values.taxStatus : null}
                            onChange={(value) => form.setFieldValue("taxStatus", value ? value : "No")}
                        />
                        <TextInput label="Select Claimant" {...form.getInputProps('selectClaimant')} />
                        <Select
                            label="Claimant Status"
                            data={["Nominee" , "Legal Heir", "Successor to the Estate of the deceased", "Administrator of the Estate of the deceased"]}
                            value={form.values.statusClaimant ? form.values.statusClaimant : null}
                            onChange={(value) => form.setFieldValue("statusClaimant", value ? value : "No")}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <TextInput label="Claimant Percentage" {...form.getInputProps('percentageClaimant')} />
                        <Select
                            label="Claimant Occupation"
                            data={["Private Sector Service" , "Public Sector Service", "Government Service", "Business", "Professional Agriculturist", "Retired", "Home Maker", "Student", "Forex Dealer", "Others"]}
                            value={form.values.occupationClaimant ? form.values.occupationClaimant : null}
                            onChange={(value) => form.setFieldValue("occupationClaimant", value ? value : "No")}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <Select
                            label="Claimant Political Exposure"
                            data={["a Politically Exposed Person" , "Related to a Politically Exposed Person", "Neither (Not applicable)"]}
                            value={form.values.politicalExposureClaimant ? form.values.politicalExposureClaimant : null}
                            onChange={(value) => form.setFieldValue("politicalExposureClaimant", value ? value : "No")}
                        />
                        <Select
                            label="Claimant Annual Income"
                            data={["Below 1 Lac" , "1-5 Lacs", "5-10 Lacs", "10-25 Lacs", "25 Lacs-1crore", ">1 crore"]}
                            value={form.values.annualIncomeClaimant ? form.values.annualIncomeClaimant : null}
                            onChange={(value) => form.setFieldValue("annualIncomeClaimant", value ? value : "No")}
                        />
                    </SimpleGrid>
                </>}
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addShareHolderDetails.isPending : updateShareHolderDetails.isPending} disabled={props.type === "Create" ? addShareHolderDetails.isPending : updateShareHolderDetails.isPending} data-disabled={props.type === "Create" ? addShareHolderDetails.isPending : updateShareHolderDetails.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default ShareHolderDetailsForm