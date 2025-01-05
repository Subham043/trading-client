import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, InputError, InputLabel, Select, SimpleGrid, Textarea } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddCommunicationTrackerMutation, useCommunicationTrackerQuery, useUpdateCommunicationTrackerMutation } from "../../hooks/data/communication_trackers";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, CommunicationTrackerFormType, CommunicationTrackerType } from "../../utils/types";
import { CommunicationTrackersListModalProps } from "../../pages/communicationTrackers/list";
import { StageType, SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { DateInput } from "@mantine/dates";
import FolioSelect from "./folioSelect";

type OptionType = {
 value: number;
 label: string;
};

type CommunicationTrackersFormProps = {
    status: boolean;
    type: "Create",
    projectId: string;
} | {
    status: boolean;
    type: "Edit";
    id: number;
    projectId: string;
}
type stageTrackersMutateOptionsType = MutateOptions<CommunicationTrackerType, Error, CommunicationTrackerFormType, unknown>;

const CommunicationTrackersForm:FC<CommunicationTrackersFormProps & {toggleModal: (value: CommunicationTrackersListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const [folios, setFolios] = useState<OptionType[]>([]);
    const {data, isFetching, isLoading, status, error,  refetch} = useCommunicationTrackerQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addCommunicationTrackers = useAddCommunicationTrackerMutation(props.projectId)
    const updateCommunicationTrackers = useUpdateCommunicationTrackerMutation(props.type === "Edit" ? props.id : 0, (data && data.projectID) ? data.projectID.toString() : '')
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                stage: data.stage ? data.stage : StageType.DocumentsCouriered,
                folios: (data && (typeof data.folios === "string")) ? data.folios : "",
                comments: data.comments ? data.comments : undefined,
                dateSent: data.dateSent ? data.dateSent : undefined,
                dateReceived: data.dateReceived ? data.dateReceived : undefined,
            });
            setFolios(data.foliosSet ? (data.foliosSet.map((folio) => ({ value: folio.id, label: folio.Folio+' ('+(folio.currentNameChangeMasters?.currentName || "")+')'|| "" }))) : []);
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
            await updateCommunicationTrackers.mutateAsync(form.values as CommunicationTrackerFormType, stageTrackersMutateOptions);
        }else{
            await addCommunicationTrackers.mutateAsync(form.values as CommunicationTrackerFormType, stageTrackersMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Select
                        label="Stage"
                        data={["DocumentsCouriered", "DocumentsReceived"]}
                        value={form.values.stage ? form.values.stage : null}
                        onChange={(value) => form.setFieldValue("stage", value ? value as StageType : "DocumentsCouriered")}
                    />
                    <div>
                        <InputLabel>Select Company/Folio</InputLabel>
                        <FolioSelect
                            projectId={Number(props.projectId)} 
                            value={folios} 
                            setValue={(value) => {form.setFieldValue("folios", value.map((folio) => folio.value).join("_")); setFolios(value.map((folio) => folio))}} 
                        />
                        <InputError>{form.errors.folios}</InputError>
                    </div>
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
                    <DateInput
                        value={form.values.dateSent ? new Date(form.values.dateSent) : undefined}
                        onChange={(value) => form.setFieldValue('dateSent', value?.toISOString())}
                        label="Date Sent"
                        placeholder="Date Sent"
                        valueFormat="DD/MM/YYYY"
                    />
                    <DateInput
                        value={form.values.dateReceived ? new Date(form.values.dateReceived) : undefined}
                        onChange={(value) => form.setFieldValue('dateReceived', value?.toISOString())}
                        label="Date Received"
                        placeholder="Date Received"
                        valueFormat="DD/MM/YYYY"
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 1 }} mt={"md"}>
                    <Textarea rows={4} label="Comment" {...form.getInputProps('comments')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addCommunicationTrackers.isPending : updateCommunicationTrackers.isPending} disabled={props.type === "Create" ? addCommunicationTrackers.isPending : updateCommunicationTrackers.isPending} data-disabled={props.type === "Create" ? addCommunicationTrackers.isPending : updateCommunicationTrackers.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default CommunicationTrackersForm