import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddDividendMasterMutation, useDividendMasterQuery, useUpdateDividendMasterMutation } from "../../hooks/data/dividend_masters";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, DividendMasterFormType, DividendMasterType } from "../../utils/types";
import { DividendMastersListModalProps } from "../../pages/dividendMasters/list";
import { SchemaType, initialValues, schema, transformValues } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { DateInput } from "@mantine/dates";


type DividendMastersFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type dividendMastersMutateOptionsType = MutateOptions<DividendMasterType, Error, DividendMasterFormType, unknown>;

const DividendMastersForm:FC<DividendMastersFormProps & {mainCompanyId: number, toggleModal: (value: DividendMastersListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useDividendMasterQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addDividendMasters = useAddDividendMasterMutation(props.mainCompanyId)
    const updateDividendMasters = useUpdateDividendMasterMutation(props.type === "Edit" ? props.id : 0, props.mainCompanyId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
        transformValues
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                recorded_date: data.recorded_date ? data.recorded_date.toString() : undefined,
                financial_year: data.financial_year ? data.financial_year : '',
                dividend_per_share: data.dividend_per_share ? Number(data.dividend_per_share) : 0,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const dividendMastersMutateOptions:dividendMastersMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", companyId: props.mainCompanyId});
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
            await updateDividendMasters.mutateAsync(form.getTransformedValues() as DividendMasterFormType, dividendMastersMutateOptions);
        }else{
            await addDividendMasters.mutateAsync(form.getTransformedValues() as DividendMasterFormType, dividendMastersMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    <DateInput
                        value={form.values.recorded_date ? new Date(form.values.recorded_date) : undefined}
                        onChange={(value) => form.setFieldValue('recorded_date', value?.toISOString() ? value.toISOString() : new Date().toISOString())}
                        label="Recorded Date"
                        placeholder="Recorded Date"
                        valueFormat="DD/MM/YYYY"
                    />
                    <TextInput label="Financial Year" {...form.getInputProps('financial_year')} />
                    <TextInput label="Dividend Per Share" {...form.getInputProps('dividend_per_share')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addDividendMasters.isPending : updateDividendMasters.isPending} disabled={props.type === "Create" ? addDividendMasters.isPending : updateDividendMasters.isPending} data-disabled={props.type === "Create" ? addDividendMasters.isPending : updateDividendMasters.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default DividendMastersForm