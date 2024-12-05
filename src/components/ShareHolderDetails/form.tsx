import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Divider, Select, SimpleGrid, TextInput, Title } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddShareHolderDetailMutation, useShareHolderDetailQuery, useUpdateShareHolderDetailMutation } from "../../hooks/data/share_holder_details";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, ShareHolderDetailFormType, ShareHolderDetailType } from "../../utils/types";
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

const ShareHolderDetailsForm:FC<ShareHolderDetailsFormProps & {mainProjectId: number, toggleModal: (value: ShareHolderDetailsListModalProps) => void;}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useShareHolderDetailQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addShareHolderDetails = useAddShareHolderDetailMutation(props.mainProjectId)
    const updateShareHolderDetails = useUpdateShareHolderDetailMutation(props.type === "Edit" ? props.id : 0, props.mainProjectId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    useEffect(() => {
        if(props.status){
            form.setValues({
                shareholderName: (data && (typeof data.shareholderName === "string")) ? data.shareholderName : "",
                shareholderNameCertificate: (data && (typeof data.shareholderNameCertificate === "string")) ? data.shareholderNameCertificate : "",
                namePan: (data && (typeof data.namePan === "string")) ? data.namePan : "",
                nameAadhar: (data && (typeof data.nameAadhar === "string")) ? data.nameAadhar : "",
                nameCml: (data && (typeof data.nameCml === "string")) ? data.nameCml : "",
                husbandName: (data && (typeof data.husbandName === "string")) ? data.husbandName : "",
                occupation: (data && (typeof data.occupation === "string")) ? data.occupation : "",
                phone: (data && (typeof data.phone === "string")) ? data.phone : "",
                email: (data && (typeof data.email === "string")) ? data.email : "",
                aadhar: (data && (typeof data.aadhar === "string")) ? data.aadhar : "",
                pan: (data && (typeof data.pan === "string")) ? data.pan : "",
                dob: (data && (typeof data.dob === "string")) ? data.dob : "",
                accountOpeningDate: (data && (typeof data.accountOpeningDate === "string")) ? data.accountOpeningDate : "",
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
                branchName: (data && (typeof data.branchName === "string")) ? data.branchName : "",
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
                addressAadhar: (data && (typeof data.addressAadhar === "string")) ? data.addressAadhar : "",
                CIN: (data && (typeof data.CIN === "string")) ? data.CIN : "",
                firstName: (data && (typeof data.firstName === "string")) ? data.firstName : "",
                middleName: (data && (typeof data.middleName === "string")) ? data.middleName : "",
                lastName: (data && (typeof data.lastName === "string")) ? data.lastName : "",
                fatherFirstName: (data && (typeof data.fatherFirstName === "string")) ? data.fatherFirstName : "",
                fatherMiddleName: (data && (typeof data.fatherMiddleName === "string")) ? data.fatherMiddleName : "",
                fatherLastName: (data && (typeof data.fatherLastName === "string")) ? data.fatherLastName : "",
                password: (data && (typeof data.password === "string")) ? data.password : "",
                confirmPassword: (data && (typeof data.confirmPassword === "string")) ? data.confirmPassword : "",
                hintQuestion: (data && (typeof data.hintQuestion === "string")) ? data.hintQuestion : "",
                hintAnswer: (data && (typeof data.hintAnswer === "string")) ? data.hintAnswer : "",
                isCompany: (data && (typeof data.isCompany === "string")) ? data.isCompany : "No",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const foliosMutateOptions:foliosMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", projectId: props.mainProjectId});
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
                    <Select
                        label="Is Client a Company?"
                        data={["Yes", "No"]}
                        value={form.values.isCompany ? form.values.isCompany : null}
                        onChange={(value) => form.setFieldValue("isCompany", value ? value : "No")}
                    />
                    <TextInput label={form.values.isCompany === "Yes" ? "Company Name" : "Share Holder Name"} {...form.getInputProps('shareholderName')} />
                    <TextInput label="Share Holder Name as per Certificate" {...form.getInputProps('shareholderNameCertificate')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Name as per PAN" {...form.getInputProps('namePan')} />
                    <TextInput label="Name as per Aadhaar" {...form.getInputProps('nameAadhar')} />
                    <TextInput label="Name as per CML" {...form.getInputProps('nameCml')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client Contact Phone Number" {...form.getInputProps('phone')} />
                    <TextInput label="Client Contact Email address" {...form.getInputProps('email')} />
                    <TextInput label="Client Aadhaar Number (if applicable)" {...form.getInputProps('aadhar')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client PAN (Permanent Account Number)" {...form.getInputProps('pan')} />
                    <DateInput 
                        label={form.values.isCompany === "Yes" ? "Company Date of Incorporation (if applicable)" : "Client Date of Birth (if applicable)" }
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
                    <TextInput label="Client Bank Branch Name" {...form.getInputProps('branchName')} />
                    <DateInput 
                        label="Client Account Opening Date" 
                        value={form.values.accountOpeningDate ? new Date(form.values.accountOpeningDate) : undefined}
                        onChange={(value) => form.setFieldValue('accountOpeningDate', value?.toISOString() ? value.toISOString() : null)}
                    />
                    <TextInput label="Client address as per Bank" {...form.getInputProps('addressBank')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client Email ID as per Bank" {...form.getInputProps('emailBank')} />
                    <TextInput label="Client Phone number as per Bank" {...form.getInputProps('phoneBank')} />
                    <TextInput label="Client Husband/Father Name" {...form.getInputProps('husbandName')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Client address PIN code" {...form.getInputProps('pincodeBank')} />
                    <TextInput label="Demat Account No." {...form.getInputProps('dematAccountNo')} />
                    <TextInput label="Client Occupation" {...form.getInputProps('occupation')} />
                </SimpleGrid>
                <Divider
                    my="xs"
                    variant="dashed"
                    label={
                        <Title order={5}>IEPF Information</Title>
                    }
                    labelPosition="left"
                />
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="First Name" {...form.getInputProps('firstName')} />
                    <TextInput label="Middle Name" {...form.getInputProps('middleName')} />
                    <TextInput label="Last Name" {...form.getInputProps('lastName')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Father's First Name" {...form.getInputProps('fatherFirstName')} />
                    <TextInput label="Father's Middle Name" {...form.getInputProps('fatherMiddleName')} />
                    <TextInput label="Father's Last Name" {...form.getInputProps('fatherLastName')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="Address as per Aadhar" {...form.getInputProps('addressAadhar')} />
                    <TextInput label="Password" {...form.getInputProps('password')} />
                    <TextInput label="Confirm Password" {...form.getInputProps('confirmPassword')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <TextInput label="CIN" {...form.getInputProps('CIN')} />
                    <TextInput label="Hint Question" {...form.getInputProps('hintQuestion')} />
                    <TextInput label="Hint Answer   " {...form.getInputProps('hintAnswer')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addShareHolderDetails.isPending : updateShareHolderDetails.isPending} disabled={props.type === "Create" ? addShareHolderDetails.isPending : updateShareHolderDetails.isPending} data-disabled={props.type === "Create" ? addShareHolderDetails.isPending : updateShareHolderDetails.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default ShareHolderDetailsForm