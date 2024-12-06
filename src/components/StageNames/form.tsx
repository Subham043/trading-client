import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddStageNameMutation, useUpdateStageNameMutation, useStageNameQuery } from "../../hooks/data/stage_names";
import { StageNamesDrawerProps } from "../../pages/stageNames";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, StageNameQueryType } from "../../utils/types";
import { SchemaType, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";


type StageNameFormProps = StageNamesDrawerProps;
type pincodeMutateOptionsType = MutateOptions<StageNameQueryType, Error, SchemaType, unknown>;
const StageNameForm:FC<StageNameFormProps & {toggleDrawer: (value: StageNamesDrawerProps) => void, refetchStageNames?: () => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error, refetch} = useStageNameQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addStageName = useAddStageNameMutation()
    const updateStageName = useUpdateStageNameMutation(props.type === "Edit" ? props.id : 0)
    const form = useForm<SchemaType>({
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                name: data.name,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const pincodeMutateOptions:pincodeMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleDrawer({status: false, type: 'Create'});
                if(props.refetchStageNames){
                    props.refetchStageNames();
                }
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
            await updateStageName.mutateAsync(form.values, pincodeMutateOptions);
        }else{
            await addStageName.mutateAsync(form.values, pincodeMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false) : true} isLoading={isLoading || isFetching} status={props.status && props.type==="Edit" ? status : "success"} error={error} hasPagination={false} refetch={refetch}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <TextInput withAsterisk data-autofocus label="Name" {...form.getInputProps('name')} />
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addStageName.isPending : updateStageName.isPending} disabled={props.type === "Create" ? addStageName.isPending : updateStageName.isPending} data-disabled={props.type === "Create" ? addStageName.isPending : updateStageName.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default StageNameForm