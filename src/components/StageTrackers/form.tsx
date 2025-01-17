import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Group, InputLabel, Select, SimpleGrid, Text, Textarea } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddStageTrackerMutation, useStageTrackerQuery, useUpdateStageTrackerMutation } from "../../hooks/data/stage_trackers";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, StageTrackerFormType, StageTrackerType } from "../../utils/types";
import { StageTrackersListModalProps } from "../../pages/stageTrackers/list";
import { PendingFromType, SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { DateInput } from "@mantine/dates";
import { useStageNamesSelectQuery } from "../../hooks/data/stage_names";
import { IconPlus } from "@tabler/icons-react";
import StageNamesDrawer from "../StageNames/drawer";
import { StageNamesDrawerProps } from "../../pages/stageNames";


type StageTrackersFormProps = {
    status: boolean;
    type: "Create",
    projectId: string;
} | {
    status: boolean;
    type: "Edit";
    id: number;
    projectId: string;
}
type stageTrackersMutateOptionsType = MutateOptions<StageTrackerType, Error, StageTrackerFormType, unknown>;

const StageTrackersForm:FC<StageTrackersFormProps & {toggleModal: (value: StageTrackersListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data:stageNames, isFetching:isStageNameFetching, isLoading:isStageNameLoading, refetch:refetchStageNames} = useStageNamesSelectQuery({search: "", enabled:props.status});
    const {data, isFetching, isLoading, status, error,  refetch} = useStageTrackerQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addStageTrackers = useAddStageTrackerMutation(props.projectId)
    const updateStageTrackers = useUpdateStageTrackerMutation(props.type === "Edit" ? props.id : 0, (data && data.projectID) ? data.projectID.toString() : '')
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    const [drawer, setDrawer] = useState<StageNamesDrawerProps>({status: false, type: 'Create'});
    const toggleDrawer = (value:StageNamesDrawerProps) => setDrawer(value);
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                pendingFrom: data.pendingFrom ? data.pendingFrom : undefined,
                stage: data.stage ? data.stage : "",
                comments: data.comments ? data.comments : undefined,
                date: data.date ? data.date : undefined,
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
            await updateStageTrackers.mutateAsync(form.values as StageTrackerFormType, stageTrackersMutateOptions);
        }else{
            await addStageTrackers.mutateAsync(form.values as StageTrackerFormType, stageTrackersMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    <>
                        <InputLabel>
                            <Group justify="space-between" gap="sm" w="100%">
                                <Text size="sm" fw={500}>Stage</Text>
                                <Text size="sm" fw={500}><Button variant="transparent" size="xs" radius="xs" type="button" onClick={() => toggleDrawer({status: true, type: 'Create'})}><IconPlus size="0.8rem" /> Add New</Button></Text>
                            </Group>
                            <Select
                                placeholder="Type to search for stage"
                                maxDropdownHeight={200}
                                data={stageNames ? stageNames.map((item) => item.name) : []}
                                searchable={false}
                                clearable
                                nothingFoundMessage="Nothing found..."
                                disabled={isStageNameFetching || isStageNameLoading}
                                error={form.errors.stage}
                                value={form.values.stage ? form.values.stage : undefined}
                                onChange={(value) => form.setFieldValue("stage", value ? value : "")}
                            />
                        </InputLabel>
                    </>
                    <Select
                        label="Pending From"
                        data={["Client", "RTA", "IEPF", "ServiceProvider"]}
                        value={form.values.pendingFrom ? form.values.pendingFrom : null}
                        onChange={(value) => form.setFieldValue("pendingFrom", value ? value as PendingFromType : "Client")}
                        error={form.errors.pendingFrom}
                    />
                    <DateInput
                        value={form.values.date ? new Date(form.values.date) : undefined}
                        onChange={(value) => form.setFieldValue('date', value?.toISOString())}
                        label="Date"
                        placeholder="Date"
                        valueFormat="DD/MM/YYYY"
                        error={form.errors.date}
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 1 }} mt={"md"}>
                    <Textarea rows={4} label="Comment" {...form.getInputProps('comments')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addStageTrackers.isPending : updateStageTrackers.isPending} disabled={props.type === "Create" ? addStageTrackers.isPending : updateStageTrackers.isPending} data-disabled={props.type === "Create" ? addStageTrackers.isPending : updateStageTrackers.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
            <StageNamesDrawer {...drawer} toggleDrawer={toggleDrawer} refetchStageNames={refetchStageNames} />
        </ErrorBoundary>
    )
}

export default StageTrackersForm