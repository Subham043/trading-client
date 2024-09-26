import { FC, useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Divider, FileInput, Select, SimpleGrid, TextInput, Title } from "@mantine/core";
import { ShareHolderMastersListModalProps } from "../../pages/shareHolderMasters/list";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { DateInput } from "@mantine/dates";


type ShareHolderMastersFormProps = {
    status: boolean;
    type: "Create",
    projectId: string;
} | {
    status: boolean;
    type: "Edit";
    id: number;
    projectId: string;
}

const ShareHolderMastersForm:FC<ShareHolderMastersFormProps & {toggleModal: (value: ShareHolderMastersListModalProps) => void}> = (props) => {

    const form = useForm();
    const [caseType, setCaseType] = useState<string>('');
    const [legalHeirs, setLegalHeirs] = useState<number>(0);

    return (
        <ErrorBoundary hasData={true} isLoading={(false)} status={"success"} error={undefined} hasPagination={false} refetch={() => {}}>
            <form onSubmit={form.onSubmit(()=>{})}>
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
                <Divider 
                    my="xs" 
                    label={
                        <Select
                            withAsterisk
                            placeholder="Select Case Type"
                            data={["Claim/Suspense" , "Claim/Suspense and Transmission" , "Claim/Suspense and Transmission and Issue of Duplicate" , "Claim/Suspense and Transmission and Issue of Duplicate and Transposition" , "Transmission" , "Transmission and Issue of Duplicate" , "Transmission and Issue of Duplicate and Transposition"]}
                            value={caseType}
                            onChange={(value) => setCaseType(value ? value : "")}
                        />
                    } 
                    labelPosition="center" 
                />
                {caseType.includes("Claim/Suspense") && <>
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
                {caseType.includes("Transmission") && <>
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
                        <TextInput label="No. of legal heirs" type="number" min={1} max={3} value={legalHeirs} onChange={(e) => setLegalHeirs(parseInt(e.target.value))} />
                    </SimpleGrid>
                    {
                        Array.from({length: legalHeirs}).map((_, i) => (
                            <div key={i}>
                                <Divider 
                                    my="xs" 
                                    variant="dashed"
                                    label={
                                        <Title order={6}>Legal Heir {i+1}</Title>
                                    } 
                                    labelPosition="left"
                                />
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
                            </div>
                        ))
                    }
                </>}
                {caseType.includes("Transposition") && <>
                    <Divider 
                        my="xs" 
                        variant="dashed"
                        label={
                            <Title order={5}>Transposition</Title>
                        } 
                        labelPosition="left"
                    />
                    <SimpleGrid cols={{ base: 1, sm: 3 }}>
                        <TextInput label="Order of Legal Heir 1" {...form.getInputProps('orderOfLegalHeir1')} />
                        <TextInput label="Order of Legal Heir 2" {...form.getInputProps('orderOfLegalHeir2')} />
                        <TextInput label="Order of Legal Heir 3" {...form.getInputProps('orderOfLegalHeir3')} />
                    </SimpleGrid>
                </>}
                <Button type='submit' variant="filled" color='blue' mt="lg" >
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default ShareHolderMastersForm