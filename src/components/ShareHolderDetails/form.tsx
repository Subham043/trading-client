import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Divider, FileInput, SimpleGrid, TextInput, Title } from "@mantine/core";
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
                ...data as SchemaType
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
                    <TextInput label="Share Holder Name as per PAN" {...form.getInputProps('shareHolderNamePan')} />
                    <TextInput label="Share Holder Name as per Aadhaar" {...form.getInputProps('shareHolderNameAadhaar')} />
                    <TextInput label="Share Holder Name as per CML" {...form.getInputProps('shareHolderNameCml')} />
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
                    <TextInput label="Client Place of Birth" {...form.getInputProps('birthPlace')} />
                    <TextInput label="Client City" {...form.getInputProps('city')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client State" {...form.getInputProps('state')} />
                    <TextInput label="Client country of birth" {...form.getInputProps('birthCountry')} />
                    <TextInput label="Client DP ID" {...form.getInputProps('dpId')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client name as per Bank account" {...form.getInputProps('nameAsPerBank')} />
                    <TextInput label="Client Bank name" {...form.getInputProps('bankName')} />
                    <TextInput label="Client Bank address" {...form.getInputProps('bankAddress')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client Bank Email ID" {...form.getInputProps('bankEmail')} />
                    <TextInput label="Client Bank Phone number" {...form.getInputProps('bankPhone')} />
                    <TextInput label="Client Bank account MICR code" {...form.getInputProps('bankMicr')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client Bank account IFS code" {...form.getInputProps('bankIfs')} />
                    <TextInput label="Client Bank Account Number" {...form.getInputProps('bankAccount')} />
                    <TextInput label="Client Bank account type" {...form.getInputProps('bankAccountType')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client address as per Bank" {...form.getInputProps('addressAsPerBank')} />
                    <TextInput label="Client Email ID as per Bank" {...form.getInputProps('emailAsPerBank')} />
                    <TextInput label="Client Phone number as per Bank" {...form.getInputProps('phoneAsPerBank')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client address PIN code" {...form.getInputProps('pinAsPerBank')} />
                </SimpleGrid>
                {props.shareHolderMasterData.caseType.includes("Claim/Suspense") && <>
                    <Divider 
                        my="xs" 
                        variant="dashed"
                        label={
                            <Title order={5}>Claim / Suspense</Title>
                        } 
                        labelPosition="left"
                    />
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <TextInput label="Share Holder Name" {...form.getInputProps('shareHolderNameClaim')} />
                        <TextInput label="Share holder name as per Certificate" {...form.getInputProps('shareHolderNameCertificateClaim')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <TextInput label="Share Holder Name as per PAN" {...form.getInputProps('shareHolderNamePanClaim')} />
                        <TextInput label="Share Holder Name as per Aadhaar" {...form.getInputProps('shareHolderNameAadhaarClaim')} />
                        <TextInput label="Share Holder Name as per CML" {...form.getInputProps('shareHolderNameCmlClaim')} />
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
                        <TextInput label="Is soleholder deceased" {...form.getInputProps('isSoleholderDeceased')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <TextInput label="Shareholder name as per Death Certificate" {...form.getInputProps('shareHolderNameDeath1')} />
                        <TextInput label="Date of Death" {...form.getInputProps('dateOfDeath1')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <TextInput label="Testate/Intestate" {...form.getInputProps('testateIntestate')} />
                        <TextInput label="Proof of sucession(Yes/No)" {...form.getInputProps('proofOfSucession')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <TextInput label="If claimant is minor" {...form.getInputProps('ifClaimantIsMinor')} />
                        <TextInput label="DOB of Minor" {...form.getInputProps('dobOfMinor')} />
                        <TextInput label="Name of Guardian of minor" {...form.getInputProps('nameOfGuardianOfMinor')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <TextInput label="Relationship of Guardian with Minor" {...form.getInputProps('relationshipOfGuardianWithMinor')} />
                        <TextInput label="PAN of Guardian" {...form.getInputProps('panOfGuardian')} />
                        <TextInput label="Name of Guardian of minor" {...form.getInputProps('nameOfGuardianOfMinor')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <FileInput label="Proof of sucession document" {...form.getInputProps('proofOfSucessionDocument')} />
                        <TextInput label="Date of document selected" {...form.getInputProps('dateOfDocument')} />
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