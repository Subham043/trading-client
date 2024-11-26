import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddPaymentTrackerMutation, usePaymentTrackerQuery, useUpdatePaymentTrackerMutation } from "../../hooks/data/payment_trackers";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, PaymentTrackerFormType, PaymentTrackerType } from "../../utils/types";
import { PaymentTrackersListModalProps } from "../../pages/paymentTrackers/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";


type PaymentTrackersFormProps = {
    status: boolean;
    type: "Create",
    projectId: string;
} | {
    status: boolean;
    type: "Edit";
    id: number;
    projectId: string;
}
type paymentTrackersMutateOptionsType = MutateOptions<PaymentTrackerType, Error, PaymentTrackerFormType, unknown>;

const PaymentTrackersForm:FC<PaymentTrackersFormProps & {toggleModal: (value: PaymentTrackersListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = usePaymentTrackerQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addPaymentTrackers = useAddPaymentTrackerMutation(props.projectId)
    const updatePaymentTrackers = useUpdatePaymentTrackerMutation(props.type === "Edit" ? props.id : 0, (data && data.projectID) ? data.projectID.toString() : '')
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                gstFlag: data.gstFlag ? data.gstFlag : undefined,
                valuation: data.valuation ? data.valuation : 0,
                percentageTotal: data.percentageTotal ? data.percentageTotal : 0,
                noOfStages: data.noOfStages ? data.noOfStages : 0,
                percentageStage: data.percentageStage ? data.percentageStage : 0,
                noOfStagesReferral: data.noOfStagesReferral ? data.noOfStagesReferral : 0,
                percentageStageReferral: data.percentageStageReferral ? data.percentageStageReferral : 0,
                amountReferral: data.amountReferral ? data.amountReferral : 0,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const paymentTrackersMutateOptions:paymentTrackersMutateOptionsType = {
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
            await updatePaymentTrackers.mutateAsync(form.values as PaymentTrackerFormType, paymentTrackersMutateOptions);
        }else{
            await addPaymentTrackers.mutateAsync(form.values as PaymentTrackerFormType, paymentTrackersMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    <TextInput label="Valuation" withAsterisk {...form.getInputProps('valuation')} />
                    <TextInput label="Percentage For Total Billing" withAsterisk {...form.getInputProps('percentageTotal')} />
                    <TextInput label="No Of Stages" withAsterisk {...form.getInputProps('noOfStages')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt={"md"}>
                    <TextInput label="Percentage For Each Stage" withAsterisk {...form.getInputProps('percentageStage')} />
                    <TextInput label="No Of Stages For Referral" withAsterisk {...form.getInputProps('noOfStagesReferral')} />
                    <TextInput label="Percentage For Each Stage For Referral" withAsterisk {...form.getInputProps('percentageStageReferral')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
                    <TextInput label="Referral amount" withAsterisk {...form.getInputProps('amountReferral')} />
                    <Select
                        label="GST Flag"
                        withAsterisk
                        data={["Yes" , "No"]}
                        value={form.values.gstFlag ? form.values.gstFlag : null}
                        onChange={(value) => form.setFieldValue("gstFlag", value ? value as "Yes" | "No" : "No")}
                    />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addPaymentTrackers.isPending : updatePaymentTrackers.isPending} disabled={props.type === "Create" ? addPaymentTrackers.isPending : updatePaymentTrackers.isPending} data-disabled={props.type === "Create" ? addPaymentTrackers.isPending : updatePaymentTrackers.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default PaymentTrackersForm