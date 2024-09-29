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
import { IconFileInfo } from "@tabler/icons-react";


type ShareHolderDetailsFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type foliosMutateOptionsType = MutateOptions<ShareHolderDetailType, Error, ShareHolderDetailFormType, unknown>;

const ShareHolderDetailsForm:FC<ShareHolderDetailsFormProps & {mainShareHolderMasterId: number, shareHolderMasterData: ShareHolderMasterType, toggleModal: (value: ShareHolderDetailsListModalProps) => void; refetchMasterData: ()=>void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useShareHolderDetailQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addShareHolderDetails = useAddShareHolderDetailMutation(props.mainShareHolderMasterId)
    const updateShareHolderDetails = useUpdateShareHolderDetailMutation(props.type === "Edit" ? props.id : 0, props.mainShareHolderMasterId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    useEffect(() => {
        if(props.status){
            form.setValues({
                shareholderName: (data && (typeof data.shareholderName === "string")) ? data.shareholderName : "",
                shareholderNamePan: (data && (typeof data.shareholderNamePan === "string")) ? data.shareholderNamePan : "",
                shareholderNameAadhar: (data && (typeof data.shareholderNameAadhar === "string")) ? data.shareholderNameAadhar : "",
                shareholderNameCertificate: (data && (typeof data.shareholderNameCertificate === "string")) ? data.shareholderNameCertificate : "",
                shareholderNameCml: (data && (typeof data.shareholderNameCml === "string")) ? data.shareholderNameCml : "",
                namePan: (data && (typeof data.namePan === "string")) ? data.namePan : "",
                nameAadhar: (data && (typeof data.nameAadhar === "string")) ? data.nameAadhar : "",
                nameCml: (data && (typeof data.nameCml === "string")) ? data.nameCml : "",
                phone: (data && (typeof data.phone === "string")) ? data.phone : "",
                email: (data && (typeof data.email === "string")) ? data.email : "",
                aadhar: (data && (typeof data.aadhar === "string")) ? data.aadhar : "",
                pan: (data && (typeof data.pan === "string")) ? data.pan : "",
                dob: (data && (typeof data.dob === "string")) ? data.dob : "",
                age: (data && (typeof data.age === "string")) ? data.age : "",
                nationality: (data && (typeof data.nationality === "string")) ? data.nationality : "",
                placeOfBirth: (data && (typeof data.placeOfBirth === "string")) ? data.placeOfBirth : "",
                city: (data && (typeof data.city === "string")) ? data.city : "",
                state: (data && (typeof data.state === "string")) ? data.state : "",
                countryOfBirth: (data && (typeof data.countryOfBirth === "string")) ? data.countryOfBirth : "",
                DPID: (data && (typeof data.DPID === "string")) ? data.DPID : "",
                dematAccountNo: (data && (typeof data.dematAccountNo === "string")) ? data.dematAccountNo : "",
                nameBank: (data && (typeof data.nameBank === "string")) ? data.nameBank : "",
                bankName: (data && (typeof data.bankName === "string")) ? data.bankName : "",
                bankAddress: (data && (typeof data.bankAddress === "string")) ? data.bankAddress : "",
                bankEmail: (data && (typeof data.bankEmail === "string")) ? data.bankEmail : "",
                bankPhone: (data && (typeof data.bankPhone === "string")) ? data.bankPhone : "",
                bankMICR: (data && (typeof data.bankMICR === "string")) ? data.bankMICR : "",
                bankIFS: (data && (typeof data.bankIFS === "string")) ? data.bankIFS : "",
                bankAccountNo: (data && (typeof data.bankAccountNo === "string")) ? data.bankAccountNo : "",
                bankAccountType: (data && (typeof data.bankAccountType === "string")) ? data.bankAccountType : "",
                addressBank: (data && (typeof data.addressBank === "string")) ? data.addressBank : "",
                emailBank: (data && (typeof data.emailBank === "string")) ? data.emailBank : "",
                phoneBank: (data && (typeof data.phoneBank === "string")) ? data.phoneBank : "",
                pincodeBank: (data && (typeof data.pincodeBank === "string")) ? data.pincodeBank : "",
                isDeceased: (data && (typeof data.isDeceased === "string")) ? data.isDeceased : "No",
                shareholderNameDeath: (data && (typeof data.shareholderNameDeath === "string")) ? data.shareholderNameDeath : "",
                dod: (data && (typeof data.dod === "string")) ? data.dod : "",
                isTestate: (data && (typeof data.isTestate === "string")) ? data.isTestate : "No",
                proofOfSucession: (data && (typeof data.proofOfSucession === "string")) ? data.proofOfSucession : "No",
                document: undefined,
                dateOfDocument: (data && (typeof data.dateOfDocument === "string")) ? data.dateOfDocument : "",
                isMinor: (data && (typeof data.isMinor === "string")) ? data.isMinor : "No",
                dobMinor: (data && (typeof data.dobMinor === "string")) ? data.dobMinor : "",
                guardianName: (data && (typeof data.guardianName === "string")) ? data.guardianName : "",
                guardianRelationship: (data && (typeof data.guardianRelationship === "string")) ? data.guardianRelationship : "",
                guardianPan: (data && (typeof data.guardianPan === "string")) ? data.guardianPan : "",
                deceasedRelationship: (data && (typeof data.deceasedRelationship === "string")) ? data.deceasedRelationship : "",
                taxStatus: (data && (typeof data.taxStatus === "string")) ? data.taxStatus : "",
                selectClaimant: (data && (typeof data.selectClaimant === "string")) ? data.selectClaimant : "",
                statusClaimant: (data && (typeof data.statusClaimant === "string")) ? data.statusClaimant : "",
                percentageClaimant: (data && (typeof data.percentageClaimant === "string")) ? data.percentageClaimant : "",
                occupationClaimant: (data && (typeof data.occupationClaimant === "string")) ? data.occupationClaimant : "",
                politicalExposureClaimant: (data && (typeof data.politicalExposureClaimant === "string")) ? data.politicalExposureClaimant : "",
                annualIncomeClaimant: (data && (typeof data.annualIncomeClaimant === "string")) ? data.annualIncomeClaimant : "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const foliosMutateOptions:foliosMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.refetchMasterData()
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
                    <DateInput 
                        label="Client Date of Birth (if applicable)" 
                        value={form.values.dob ? new Date(form.values.dob) : undefined}
                        onChange={(value) => form.setFieldValue('dob', value?.toISOString() ? value.toISOString() : null)}
                    />
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
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Client address PIN code" {...form.getInputProps('pincodeBank')} />
                    <TextInput label="Demat Account No." {...form.getInputProps('dematAccountNo')} />
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
                    <SimpleGrid cols={{ base: 1, sm: 1 }}>
                        <Select
                            label="Is soleholder deceased"
                            data={["Yes" , "No"]}
                            value={form.values.isDeceased ? form.values.isDeceased : null}
                            onChange={(value) => form.setFieldValue("isDeceased", value ? value : "No")}
                        />
                    </SimpleGrid>
                    {form.values.isDeceased==="Yes" && <>
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
                            data={["Yes" , "No"]}
                            value={form.values.isMinor ? form.values.isMinor : null}
                            onChange={(value) => form.setFieldValue("isMinor", value ? value : "No")}
                        />
                    </SimpleGrid>
                    {form.values.isMinor==="Yes" && <>
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
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
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