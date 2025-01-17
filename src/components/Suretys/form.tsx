import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddSuretyMutation, useSuretyQuery, useUpdateSuretyMutation } from "../../hooks/data/suretys";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, SuretyFormType, SuretyType } from "../../utils/types";
import { SuretysListModalProps } from "../../pages/suretys/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";

type SuretysFormProps = {
    status: boolean;
    type: "Create",
    projectId: string;
} | {
    status: boolean;
    type: "Edit";
    id: number;
    projectId: string;
}
type stageTrackersMutateOptionsType = MutateOptions<SuretyType, Error, SuretyFormType, unknown>;

const SuretysForm:FC<SuretysFormProps & {toggleModal: (value: SuretysListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useSuretyQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addSuretys = useAddSuretyMutation(props.projectId)
    const updateSuretys = useUpdateSuretyMutation(props.type === "Edit" ? props.id : 0, (data && data.projectID) ? data.projectID.toString() : '')
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                companyName: (data && (typeof data.companyName === "string")) ? data.companyName : "",
                fullName: (data && (typeof data.fullName === "string")) ? data.fullName : "",
                age: (data && (typeof data.age === "string")) ? data.age : "",
                address: (data && (typeof data.address === "string")) ? data.address : "",
                isEmployed: (data && (typeof data.isEmployed === "string")) ? data.isEmployed : "No",
                employerName: (data && (typeof data.employerName === "string")) ? data.employerName : "",
                employerAddress: (data && (typeof data.employerAddress === "string")) ? data.employerAddress : "",
                salary: (data && (typeof data.salary === "string")) ? data.salary : "",
                isBusiness: (data && (typeof data.isBusiness === "string")) ? data.isBusiness : "No",
                businessName: (data && (typeof data.businessName === "string")) ? data.businessName : "",
                businessNature: (data && (typeof data.businessNature === "string")) ? data.businessNature : "",
                businessIncome: (data && (typeof data.businessIncome === "string")) ? data.businessIncome : "",
                businessProfit: (data && (typeof data.businessProfit === "string")) ? data.businessProfit : "",
                businessAddress: (data && (typeof data.businessAddress === "string")) ? data.businessAddress : "",
                isProperty: (data && (typeof data.isProperty === "string")) ? data.isProperty : "No",
                propertyType: (data && (typeof data.propertyType === "string")) ? data.propertyType : "",
                propertySituation: (data && (typeof data.propertySituation === "string")) ? data.propertySituation : "",
                propertyValue: (data && (typeof data.propertyValue === "string")) ? data.propertyValue : "",
                propertyRent: (data && (typeof data.propertyRent === "string")) ? data.propertyRent : "",
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
            await updateSuretys.mutateAsync(form.values as SuretyFormType, stageTrackersMutateOptions);
        }else{
            await addSuretys.mutateAsync(form.values as SuretyFormType, stageTrackersMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput label="Company Name" autoFocus {...form.getInputProps('companyName')} />
                    <TextInput label="Full Name" autoFocus {...form.getInputProps('fullName')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
                    <TextInput label="Age" autoFocus {...form.getInputProps('age')} />
                    <TextInput label="Address" autoFocus {...form.getInputProps('address')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm:  form.values.isEmployed==="Yes" ? 2 : 1 }} mt={"md"}>
                    <Select
                        label="Is employed?"
                        data={["Yes", "No"]}
                        value={form.values.isEmployed ? form.values.isEmployed : null}
                        onChange={(value) => form.setFieldValue("isEmployed", value ? value : "No")}
                        error={form.errors.isEmployed}
                    />
                    {
                        form.values.isEmployed==="Yes" &&
                        <TextInput label="Employer Name" autoFocus {...form.getInputProps('employerName')} />
                    }
                </SimpleGrid>
                {form.values.isEmployed === "Yes" && <>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <TextInput label="Total Salary For The Year" {...form.getInputProps('salary')} />
                        <TextInput label="Employer Address" {...form.getInputProps('employerAddress')} />
                    </SimpleGrid>
                </>}
                <SimpleGrid cols={{ base: 1, sm:  form.values.isBusiness==="Yes" ? 2 : 1 }} mt={"md"}>
                    <Select
                        label="Is self-occupied/business?"
                        data={["Yes", "No"]}
                        value={form.values.isBusiness ? form.values.isBusiness : null}
                        onChange={(value) => form.setFieldValue("isBusiness", value ? value : "No")}
                        error={form.errors.isBusiness}
                    />
                    {
                        form.values.isBusiness==="Yes" &&
                        <TextInput label="Business Name" autoFocus {...form.getInputProps('businessName')} />
                    }
                </SimpleGrid>
                {form.values.isBusiness === "Yes" && <>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <TextInput label="Business Nature" {...form.getInputProps('businessNature')} />
                        <TextInput label="Business Annual Income" {...form.getInputProps('businessIncome')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <TextInput label="Business Annual Profit" {...form.getInputProps('businessProfit')} />
                        <TextInput label="Business Address" {...form.getInputProps('businessAddress')} />
                    </SimpleGrid>
                </>}
                <SimpleGrid cols={{ base: 1, sm:  form.values.isProperty==="Yes" ? 2 : 1 }} mt={"md"}>
                    <Select
                        label="Own Property?"
                        data={["Yes", "No"]}
                        value={form.values.isProperty ? form.values.isProperty : null}
                        onChange={(value) => form.setFieldValue("isProperty", value ? value : "No")}
                        error={form.errors.isProperty}
                    />
                    {
                        form.values.isProperty==="Yes" &&
                        <Select
                            label="Property Type"
                            data={["House", "Mere Land"]}
                            value={form.values.propertyType ? form.values.propertyType : null}
                            onChange={(value) => form.setFieldValue("propertyType", value ? value : "House")}
                            error={form.errors.propertyType}
                        />
                    }
                </SimpleGrid>
                {form.values.isProperty === "Yes" && <>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <TextInput label="Property Situation" {...form.getInputProps('propertySituation')} />
                        <TextInput label="Property Value" {...form.getInputProps('propertyValue')} />
                        <TextInput label="Property Annual Rent" {...form.getInputProps('propertyRent')} />
                    </SimpleGrid>
                </>}
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addSuretys.isPending : updateSuretys.isPending} disabled={props.type === "Create" ? addSuretys.isPending : updateSuretys.isPending} data-disabled={props.type === "Create" ? addSuretys.isPending : updateSuretys.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default SuretysForm