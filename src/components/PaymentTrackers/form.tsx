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
import { useProjectTotalValuationQuery } from "../../hooks/data/projects";


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
    const {data:valuation, isFetching:isValuationFetching, isLoading:isValuationLoading} = useProjectTotalValuationQuery(Number(props.projectId), true);
    const addPaymentTrackers = useAddPaymentTrackerMutation(props.projectId)
    const updatePaymentTrackers = useUpdatePaymentTrackerMutation(props.type === "Edit" ? props.id : 0, (data && data.projectID) ? data.projectID.toString() : '')
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                tdsFlag: data.tdsFlag ? data.tdsFlag : undefined,
                valuation: data.valuation ? data.valuation : 0,
                percentageTotal: data.percentageTotal ? data.percentageTotal : 0,
                noOfStages: data.noOfStages ? data.noOfStages : 0,
                percentageStage: data.percentageStage ? data.percentageStage : 0,
                noOfStagesReferral: data.noOfStagesReferral ? data.noOfStagesReferral : 0,
                percentageStageReferral: data.percentageStageReferral ? data.percentageStageReferral : 0,
                amountReferral: data.amountReferral ? data.amountReferral : 0,
                tdsPercentage: data.tdsPercentage ? data.tdsPercentage : 0,
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
                    {/* <TextInput label="Valuation" withAsterisk {...form.getInputProps('valuation')} /> */}
                    <Select
                        label="Valuation"
                        placeholder="Valuation"
                        maxDropdownHeight={200}
                        data={valuation ? [{value: valuation.totalValuationInBse.toString(), label: valuation.totalValuationInBse.toString()+' (BSE)'}, {value: valuation.totalValuationInNse.toString(), label: valuation.totalValuationInNse.toString()+' (NSE)'}] : []}
                        searchable={false}
                        clearable
                        withAsterisk
                        nothingFoundMessage="Nothing found..."
                        disabled={isValuationFetching || isValuationLoading}
                        error={form.errors.valuation}
                        value={form.values.valuation ? form.values.valuation.toString() : undefined}
                        onChange={(value) => form.setFieldValue("valuation", value ? Number(value) : 0)}
                    />
                    <TextInput label="Percentage For Total Billing" withAsterisk {...form.getInputProps('percentageTotal')} />
                    <TextInput label="No Of Stages" withAsterisk {...form.getInputProps('noOfStages')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt={"md"}>
                    <TextInput label="Percentage For Each Stage" withAsterisk {...form.getInputProps('percentageStage')} />
                    <TextInput label="No Of Stages For Referral" withAsterisk {...form.getInputProps('noOfStagesReferral')} />
                    <TextInput label="Percentage For Each Stage For Referral" withAsterisk {...form.getInputProps('percentageStageReferral')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt={"md"}>
                    <TextInput label="Referral amount" withAsterisk {...form.getInputProps('amountReferral')} />
                    <Select
                        label="TDS Flag"
                        withAsterisk
                        data={["Yes" , "No"]}
                        value={form.values.tdsFlag ? form.values.tdsFlag : null}
                        onChange={(value) => form.setFieldValue("tdsFlag", value ? value as "Yes" | "No" : "No")}
                        error={form.errors.tdsFlag}
                    />
                    {
                        form.values.tdsFlag==="Yes" &&
                        <TextInput label="TDS Percentage" withAsterisk {...form.getInputProps('tdsPercentage')} />
                    }
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addPaymentTrackers.isPending : updatePaymentTrackers.isPending} disabled={props.type === "Create" ? addPaymentTrackers.isPending : updatePaymentTrackers.isPending} data-disabled={props.type === "Create" ? addPaymentTrackers.isPending : updatePaymentTrackers.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default PaymentTrackersForm