import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddCorporateMasterMutation, useCorporateMasterQuery, useUpdateCorporateMasterMutation } from "../../hooks/data/corporate_masters";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, CorporateMasterFormType, CorporateMasterType } from "../../utils/types";
import { CorporateMastersListModalProps } from "../../pages/corporateMasters/list";
import { SchemaType, initialValues, schema, transformValues } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { DateInput } from "@mantine/dates";


type CorporateMastersFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type corporateMastersMutateOptionsType = MutateOptions<CorporateMasterType, Error, CorporateMasterFormType, unknown>;

const CorporateMastersForm:FC<CorporateMastersFormProps & {mainCompanyId: number, toggleModal: (value: CorporateMastersListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useCorporateMasterQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addCorporateMasters = useAddCorporateMasterMutation(props.mainCompanyId)
    const updateCorporateMasters = useUpdateCorporateMasterMutation(props.type === "Edit" ? props.id : 0, props.mainCompanyId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
        transformValues
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                date: (data  && data.date) ? data.date.toString() : undefined,
                type: data.type ? data.type : "Bonus",
                numerator: data.numerator ? Number(data.numerator) : 0,
                denominator: data.denominator ? Number(data.denominator) : 0,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const corporateMastersMutateOptions:corporateMastersMutateOptionsType = {
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
            await updateCorporateMasters.mutateAsync(form.getTransformedValues() as CorporateMasterFormType, corporateMastersMutateOptions);
        }else{
            await addCorporateMasters.mutateAsync(form.getTransformedValues() as CorporateMasterFormType, corporateMastersMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <DateInput
                        value={form.values.date ? new Date(form.values.date) : undefined}
                        onChange={(value) => form.setFieldValue('date', value?.toISOString() ? value.toISOString() : new Date().toISOString())}
                        label="Date"
                        placeholder="Date"
                    />
                    <Select
                        label="Equity Type"
                        withAsterisk
                        data={["Equity", "Bonus", "ShareBought", "Rights", "Splits"]}
                        value={form.values.type ? form.values.type : null}
                        onChange={(value) => form.setFieldValue("type", value ? value as "Equity" | "Bonus" | "ShareBought" | "Rights" | "Splits" : "Bonus")}
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput label="Numrator" {...form.getInputProps('numerator')} />
                    <TextInput label="Denominator" {...form.getInputProps('denominator')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addCorporateMasters.isPending : updateCorporateMasters.isPending} disabled={props.type === "Create" ? addCorporateMasters.isPending : updateCorporateMasters.isPending} data-disabled={props.type === "Create" ? addCorporateMasters.isPending : updateCorporateMasters.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default CorporateMastersForm