import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddShareHolderMasterMutation, useShareHolderMasterQuery, useUpdateShareHolderMasterMutation } from "../../hooks/data/share_holder_masters";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, ShareHolderMasterFormType, ShareHolderMasterType } from "../../utils/types";
import { ShareHolderMastersListModalProps } from "../../pages/shareHolderMasters/list";
import { CaseType, SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";


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
type shareHolderMastersMutateOptionsType = MutateOptions<ShareHolderMasterType, Error, ShareHolderMasterFormType, unknown>;

const ShareHolderMastersForm:FC<ShareHolderMastersFormProps & {toggleModal: (value: ShareHolderMastersListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useShareHolderMasterQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addShareHolderMasters = useAddShareHolderMasterMutation(props.projectId)
    const updateShareHolderMasters = useUpdateShareHolderMasterMutation(props.type === "Edit" ? props.id : 0, (data && data.projectID) ? data.projectID.toString() : '')
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                caseType: data.caseType ? data.caseType as CaseType : undefined,
                noOfLegalHeir: data.noOfLegalHeir ? data.noOfLegalHeir : undefined,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const shareHolderMastersMutateOptions:shareHolderMastersMutateOptionsType = {
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
            await updateShareHolderMasters.mutateAsync(form.values as ShareHolderMasterFormType, shareHolderMastersMutateOptions);
        }else{
            await addShareHolderMasters.mutateAsync(form.values as ShareHolderMasterFormType, shareHolderMastersMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Select
                        label="Instrument Type"
                        withAsterisk
                        data={["ClaimSuspense" , "ClaimSuspenseTransmission" , "ClaimSuspenseTransmissionIssueDuplicate" , "ClaimSuspenseTransmissionIssueDuplicateTransposition" , "Transmission" , "TransmissionIssueDuplicate" , "TransmissionIssueDuplicateTransposition"]}
                        value={form.values.caseType ? form.values.caseType : null}
                        onChange={(value) => form.setFieldValue("caseType", value ? value as CaseType : "ClaimSuspense")}
                    />
                    <TextInput label="No. of Legal Heirs" {...form.getInputProps('noOfLegalHeir')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addShareHolderMasters.isPending : updateShareHolderMasters.isPending} disabled={props.type === "Create" ? addShareHolderMasters.isPending : updateShareHolderMasters.isPending} data-disabled={props.type === "Create" ? addShareHolderMasters.isPending : updateShareHolderMasters.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default ShareHolderMastersForm