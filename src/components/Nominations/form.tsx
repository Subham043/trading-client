import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddNominationMutation, useNominationQuery, useUpdateNominationMutation } from "../../hooks/data/nominations";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, NominationFormType, NominationType } from "../../utils/types";
import { NominationsListModalProps } from "../../pages/nominations/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { DateInput } from "@mantine/dates";

type NominationsFormProps = {
    status: boolean;
    type: "Create",
    projectId: string;
} | {
    status: boolean;
    type: "Edit";
    id: number;
    projectId: string;
}
type stageTrackersMutateOptionsType = MutateOptions<NominationType, Error, NominationFormType, unknown>;

const NominationsForm:FC<NominationsFormProps & {toggleModal: (value: NominationsListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useNominationQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addNominations = useAddNominationMutation(props.projectId)
    const updateNominations = useUpdateNominationMutation(props.type === "Edit" ? props.id : 0, (data && data.projectID) ? data.projectID.toString() : '')
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                fullName: (data && (typeof data.fullName === "string")) ? data.fullName : "",
                fatherName: (data && (typeof data.fatherName === "string")) ? data.fatherName : "",
                occupation: (data && (typeof data.occupation === "string")) ? data.occupation : "",
                nationality: (data && (typeof data.nationality === "string")) ? data.nationality : "",
                email: (data && (typeof data.email === "string")) ? data.email : "",
                relationship: (data && (typeof data.relationship === "string")) ? data.relationship : "",
                mobile: (data && (typeof data.mobile === "string")) ? data.mobile : "",
                pan: (data && (typeof data.pan === "string")) ? data.pan : "",
                address: (data && (typeof data.address === "string")) ? data.address : "",
                isMinor: (data && (typeof data.isMinor === "string")) ? data.isMinor : "No",
                dobMinor: (data && (typeof data.dobMinor === "string") && data.dobMinor !== "null") ? data.dobMinor : "",
                dateMajority: (data && (typeof data.dateMajority === "string") && data.dateMajority !== "null") ? data.dateMajority : "",
                gurdianName: (data && (typeof data.gurdianName === "string")) ? data.gurdianName : "",
                gurdianAddress: (data && (typeof data.gurdianAddress === "string")) ? data.gurdianAddress : "",
                isDeceased: (data && (typeof data.isDeceased === "string")) ? data.isDeceased : "No",
                deceasedName: (data && (typeof data.deceasedName === "string")) ? data.deceasedName : "",
                dobDeceased: (data && (typeof data.dobDeceased === "string") && data.dobDeceased !== "null") ? data.dobDeceased : "",
                deceasedFatherName: (data && (typeof data.deceasedFatherName === "string")) ? data.deceasedFatherName : "",
                deceasedOccupation: (data && (typeof data.deceasedOccupation === "string")) ? data.deceasedOccupation : "",
                deceasedNationality: (data && (typeof data.deceasedNationality === "string")) ? data.deceasedNationality : "",
                deceasedEmail: (data && (typeof data.deceasedEmail === "string")) ? data.deceasedEmail : "",
                deceasedRelationship: (data && (typeof data.deceasedRelationship === "string")) ? data.deceasedRelationship : "",
                deceasedRelationshipMinor: (data && (typeof data.deceasedRelationshipMinor === "string")) ? data.deceasedRelationshipMinor : "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const stageTrackersMutateOptions:stageTrackersMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", projectId: props.projectId ?? ''});
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
            await updateNominations.mutateAsync(form.values as NominationFormType, stageTrackersMutateOptions);
        }else{
            await addNominations.mutateAsync(form.values as NominationFormType, stageTrackersMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput label="Full Name" autoFocus {...form.getInputProps('fullName')} />
                    <TextInput label="Father/Mother/Spouse Name" {...form.getInputProps('fatherName')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
                    <TextInput label="Occupation" {...form.getInputProps('occupation')} />
                    <TextInput label="Nationality" {...form.getInputProps('nationality')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
                    <TextInput label="Email" {...form.getInputProps('email')} />
                    <TextInput label="Mobile" {...form.getInputProps('mobile')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
                    <TextInput label="Relationship with Security Holder" {...form.getInputProps('relationship')} />
                    <TextInput label="Pan" {...form.getInputProps('pan')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 1 }} mt={"md"}>
                    <Textarea label="Address" rows={3} {...form.getInputProps('address')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm:  form.values.isMinor==="Yes" ? 2 : 1 }} mt={"md"}>
                    <Select
                        label="Is minor?"
                        data={["Yes", "No"]}
                        value={form.values.isMinor ? form.values.isMinor : null}
                        onChange={(value) => form.setFieldValue("isMinor", value ? value : "No")}
                        error={form.errors.isMinor}
                    />
                    {
                        form.values.isMinor==="Yes" &&
                        <TextInput label="Gurdian Name" {...form.getInputProps('gurdianName')} />
                    }
                </SimpleGrid>
                {form.values.isMinor === "Yes" && <>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <DateInput
                            label="Date of Birth"
                            valueFormat="DD/MM/YYYY"
                            value={form.values.dobMinor ? new Date(form.values.dobMinor) : undefined}
                            onChange={(value) => form.setFieldValue('dobMinor', value?.toISOString() ? value.toISOString() : null)}
                            error={form.errors.dobMinor}
                        />
                        <DateInput
                            label="Date of Attaining Majority"
                            valueFormat="DD/MM/YYYY"
                            value={form.values.dateMajority ? new Date(form.values.dateMajority) : undefined}
                            onChange={(value) => form.setFieldValue('dateMajority', value?.toISOString() ? value.toISOString() : null)}
                            error={form.errors.dateMajority}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 1 }} mt="md">
                        <Textarea label="Gurdian Address" rows={3} {...form.getInputProps('gurdianAddress')} />
                    </SimpleGrid>
                </>}
                <SimpleGrid cols={{ base: 1, sm:  form.values.isDeceased==="Yes" ? 2 : 1 }} mt={"md"}>
                    <Select
                        label="Is Deceased?"
                        data={["Yes", "No"]}
                        value={form.values.isDeceased ? form.values.isDeceased : null}
                        onChange={(value) => form.setFieldValue("isDeceased", value ? value : "No")}
                        error={form.errors.isDeceased}
                    />
                    {
                        form.values.isDeceased==="Yes" &&
                        <TextInput label="Relationship with Minor" {...form.getInputProps('deceasedRelationshipMinor')} />
                    }
                </SimpleGrid>
                {form.values.isDeceased === "Yes" && <>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <TextInput label="Full Name" {...form.getInputProps('deceasedName')} />
                        <TextInput label="Father/Mother/Spouse Name" {...form.getInputProps('deceasedFatherName')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
                        <TextInput label="Occupation" {...form.getInputProps('deceasedOccupation')} />
                        <TextInput label="Nationality" {...form.getInputProps('deceasedNationality')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt={"md"}>
                        <TextInput label="Email" {...form.getInputProps('deceasedEmail')} />
                        <DateInput
                            label="Date of Birth"
                            valueFormat="DD/MM/YYYY"
                            value={form.values.dobDeceased ? new Date(form.values.dobDeceased) : undefined}
                            onChange={(value) => form.setFieldValue('dobDeceased', value?.toISOString() ? value.toISOString() : null)}
                            error={form.errors.dobDeceased}
                        />
                        <TextInput label="Relationship with Security Holder" {...form.getInputProps('deceasedRelationship')} />
                    </SimpleGrid>
                </>}
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addNominations.isPending : updateNominations.isPending} disabled={props.type === "Create" ? addNominations.isPending : updateNominations.isPending} data-disabled={props.type === "Create" ? addNominations.isPending : updateNominations.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default NominationsForm