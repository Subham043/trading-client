import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, InputError, InputLabel, SimpleGrid } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddIepfTrackerMutation, useIepfTrackerQuery, useUpdateIepfTrackerMutation } from "../../hooks/data/iepf_trackers";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, IepfTrackerFormType, IepfTrackerType } from "../../utils/types";
import { IepfTrackersListModalProps } from "../../pages/iepfTrackers/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import ShareHolderSelect from "./shareHolderSelect";
import LegalHeirSelect from "./legalHeirSelect";

type OptionType = {
 value: number;
 label: string;
};

type IepfTrackersFormProps = {
    status: boolean;
    type: "Create",
    projectId: string;
} | {
    status: boolean;
    type: "Edit";
    id: number;
    projectId: string;
}
type stageTrackersMutateOptionsType = MutateOptions<IepfTrackerType, Error, IepfTrackerFormType, unknown>;

const IepfTrackersForm:FC<IepfTrackersFormProps & {toggleModal: (value: IepfTrackersListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const [shareHolders, setShareHolders] = useState<OptionType[]>([]);
    const [legalHeirs, setLegalHeirs] = useState<OptionType[]>([]);
    const {data, isFetching, isLoading, status, error,  refetch} = useIepfTrackerQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addIepfTrackers = useAddIepfTrackerMutation(props.projectId)
    const updateIepfTrackers = useUpdateIepfTrackerMutation(props.type === "Edit" ? props.id : 0, (data && data.projectID) ? data.projectID.toString() : '')
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                shareHolderDetails: (data && (typeof data.shareHolderDetails === "string")) ? data.shareHolderDetails : "",
                legalHeirDetails: (data && (typeof data.legalHeirDetails === "string")) ? data.legalHeirDetails : "",
            });
            setShareHolders(data.shareHolderDetailSet ? (data.shareHolderDetailSet.map((shareHolderDetail) => ({ value: shareHolderDetail.id, label: shareHolderDetail.shareholderName || "" }))) : []);
            setLegalHeirs(data.legalHeirDetailSet ? (data.legalHeirDetailSet.map((legalHeirDetail) => ({ value: legalHeirDetail.id, label: legalHeirDetail.namePan || "" }))) : []);
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
            await updateIepfTrackers.mutateAsync(form.values as IepfTrackerFormType, stageTrackersMutateOptions);
        }else{
            await addIepfTrackers.mutateAsync(form.values as IepfTrackerFormType, stageTrackersMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <div>
                        <InputLabel>Select Share Holders</InputLabel>
                        <ShareHolderSelect
                            projectId={Number(props.projectId)} 
                            value={shareHolders} 
                            setValue={(value) => {form.setFieldValue("shareHolderDetails", value.map((folio) => folio.value).join("_")); setShareHolders(value.map((folio) => folio))}} 
                        />
                        <InputError>{form.errors.shareHolderDetails}</InputError>
                    </div>
                    <div>
                        <InputLabel>Select Legal Heirs</InputLabel>
                        <LegalHeirSelect
                            projectId={Number(props.projectId)} 
                            value={legalHeirs} 
                            setValue={(value) => {form.setFieldValue("legalHeirDetails", value.map((folio) => folio.value).join("_")); setLegalHeirs(value.map((folio) => folio))}} 
                        />
                        <InputError>{form.errors.legalHeirDetails}</InputError>
                    </div>
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addIepfTrackers.isPending : updateIepfTrackers.isPending} disabled={props.type === "Create" ? addIepfTrackers.isPending : updateIepfTrackers.isPending} data-disabled={props.type === "Create" ? addIepfTrackers.isPending : updateIepfTrackers.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default IepfTrackersForm