import { FC, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddCertificateMutation, useCertificateQuery, useUpdateCertificateMutation } from "../../hooks/data/certificates";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, CertificateFormType, CertificateType } from "../../utils/types";
import { CertificatesListModalProps } from "../../pages/certificates/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";

type CertificatesFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type certificatesMutateOptionsType = MutateOptions<CertificateType, Error, CertificateFormType, unknown>;

const CertificatesForm:FC<CertificatesFormProps & {mainFolioId: number, toggleModal: (value: CertificatesListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useCertificateQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addCertificates = useAddCertificateMutation(props.mainFolioId)
    const updateCertificates = useUpdateCertificateMutation(props.type === "Edit" ? props.id : 0, props.mainFolioId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });

    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                certificateNumber: data.certificateNumber ? data.certificateNumber : undefined,
                certificateSerialNumber: data.certificateSerialNumber ? data.certificateSerialNumber : undefined,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);

    const onSubmit = async () => {
        const certificatesMutateOptions:certificatesMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", folioId: props.mainFolioId});
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
            await updateCertificates.mutateAsync(form.values as CertificateFormType, certificatesMutateOptions);
        }else{
            await addCertificates.mutateAsync(form.values as CertificateFormType, certificatesMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput label="Certificate Number" {...form.getInputProps('certificateNumber')} />
                    <TextInput label="Certificate Serial Number" {...form.getInputProps('certificateSerialNumber')} />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addCertificates.isPending : updateCertificates.isPending} disabled={props.type === "Create" ? addCertificates.isPending : updateCertificates.isPending} data-disabled={props.type === "Create" ? addCertificates.isPending : updateCertificates.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default CertificatesForm