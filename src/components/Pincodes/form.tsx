import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddPincodeMutation, useUpdatePincodeMutation, usePincodeQuery } from "../../hooks/data/pincodes";
import { PincodesDrawerProps } from "../../pages/pincodes";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, PincodeQueryType } from "../../utils/types";
import { SchemaType, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";


type PincodeFormProps = PincodesDrawerProps;
type pincodeMutateOptionsType = MutateOptions<PincodeQueryType, Error, SchemaType, unknown>;
const PincodeForm:FC<PincodeFormProps & {toggleDrawer: (value: PincodesDrawerProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error, refetch} = usePincodeQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addPincode = useAddPincodeMutation()
    const updatePincode = useUpdatePincodeMutation(props.type === "Edit" ? props.id : 0)
    const form = useForm<SchemaType>({
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                circle_name: data.circle_name,
                pincode: data.pincode,
                state_name: data.state_name,
                region_name: data.region_name,
                division_name: data.division_name,
                office_name: data.office_name,
                office_type: data.office_type,
                district: data.district
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const pincodeMutateOptions:pincodeMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleDrawer({status: false, type: 'Create'});
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
            await updatePincode.mutateAsync(form.values, pincodeMutateOptions);
        }else{
            await addPincode.mutateAsync(form.values, pincodeMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false) : true} isLoading={isLoading || isFetching} status={props.status && props.type==="Edit" ? status : "success"} error={error} hasPagination={false} refetch={refetch}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <TextInput withAsterisk data-autofocus label="State Name" {...form.getInputProps('state_name')} />
                <TextInput withAsterisk label="Circle Name" {...form.getInputProps('circle_name')} mt="md" />
                <TextInput withAsterisk label="Region Name" {...form.getInputProps('region_name')} mt="md" />
                <TextInput withAsterisk label="Division Name" {...form.getInputProps('division_name')} mt="md" />
                <TextInput withAsterisk label="Office Name" {...form.getInputProps('office_name')} mt="md" />
                <TextInput withAsterisk label="Pincode" {...form.getInputProps('pincode')} mt="md" />
                <TextInput withAsterisk label="Office Type" {...form.getInputProps('office_type')} mt="md" />
                <TextInput withAsterisk label="District" {...form.getInputProps('district')} mt="md" />
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addPincode.isPending : updatePincode.isPending} disabled={props.type === "Create" ? addPincode.isPending : updatePincode.isPending} data-disabled={props.type === "Create" ? addPincode.isPending : updatePincode.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default PincodeForm