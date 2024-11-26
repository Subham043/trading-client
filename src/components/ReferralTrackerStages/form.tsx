import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddReferralTrackerStageMutation, useReferralTrackerStageQuery, useUpdateReferralTrackerStageMutation } from "../../hooks/data/referral_tracker_stages";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, ReferralTrackerStageFormType, ReferralTrackerStageType } from "../../utils/types";
import { ReferralTrackerStagesListModalProps } from "../../pages/referralTrackerStages/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";

type ReferralTrackerStagesFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type foliosMutateOptionsType = MutateOptions<ReferralTrackerStageType, Error, ReferralTrackerStageFormType, unknown>;

const ReferralTrackerStagesForm:FC<ReferralTrackerStagesFormProps & {mainPaymentTrackerId: number, projectId: number, toggleModal: (value: ReferralTrackerStagesListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useReferralTrackerStageQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addReferralTrackerStages = useAddReferralTrackerStageMutation(props.mainPaymentTrackerId)
    const updateReferralTrackerStages = useUpdateReferralTrackerStageMutation(props.type === "Edit" ? props.id : 0, props.mainPaymentTrackerId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                status: data.status ? data.status : undefined,
                amount: data.amount ? data.amount : 0,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const foliosMutateOptions:foliosMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", paymentTrackerId: props.mainPaymentTrackerId});
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
            await updateReferralTrackerStages.mutateAsync(form.values as ReferralTrackerStageFormType, foliosMutateOptions);
        }else{
            await addReferralTrackerStages.mutateAsync(form.values as ReferralTrackerStageFormType, foliosMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Select
                        label="Equity Type"
                        withAsterisk
                        data={["Paid", "ToBePaid"]}
                        value={form.values.status ? form.values.status : null}
                        onChange={(value) => form.setFieldValue("status", value ? value as "InvoiceSent" | "Paid" | "ReceiptSent" | "ToBePaid" : "ToBePaid")}
                    />
                    <TextInput label="Amount" {...form.getInputProps('amount')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addReferralTrackerStages.isPending : updateReferralTrackerStages.isPending} disabled={props.type === "Create" ? addReferralTrackerStages.isPending : updateReferralTrackerStages.isPending} data-disabled={props.type === "Create" ? addReferralTrackerStages.isPending : updateReferralTrackerStages.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default ReferralTrackerStagesForm