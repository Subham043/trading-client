import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, InputError, InputLabel, SimpleGrid, TextInput } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddFolioMutation, useFolioQuery, useUpdateFolioMutation } from "../../hooks/data/folios";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, FolioFormType, FolioType } from "../../utils/types";
import { FoliosListModalProps } from "../../pages/folios/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import ShareHolderSelect from "./shareholderSelect";

type OptionType = {
 value: number;
 label: string;
};

type ShareHolderSelectType = {
    shareholderName1: OptionType|undefined;
    shareholderName2: OptionType|undefined;
    shareholderName3: OptionType|undefined;
}

type FoliosFormProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}
type foliosMutateOptionsType = MutateOptions<FolioType, Error, FolioFormType, unknown>;

const FoliosForm:FC<FoliosFormProps & {mainShareCertificateMasterId: number, projectId: number, toggleModal: (value: FoliosListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const {data, isFetching, isLoading, status, error,  refetch} = useFolioQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addFolios = useAddFolioMutation(props.mainShareCertificateMasterId)
    const updateFolios = useUpdateFolioMutation(props.type === "Edit" ? props.id : 0, props.mainShareCertificateMasterId)
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    const [shareholderSelect, setShareholderSelect] = useState<ShareHolderSelectType>({
        shareholderName1: undefined,
        shareholderName2: undefined,
        shareholderName3: undefined
    });
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            form.setValues({
                Folio: data.Folio ? data.Folio : "",
                shareholderName1ID: data.shareholderName1ID ? data.shareholderName1ID : undefined,
                shareholderName2ID: data.shareholderName2ID ? data.shareholderName2ID : undefined,
                shareholderName3ID: data.shareholderName3ID ? data.shareholderName3ID : undefined,
            });
            setShareholderSelect({
                shareholderName1: (typeof data.shareholderName1 !== "undefined" && data.shareholderName1) ? {value: data.shareholderName1.id, label: (data.shareholderName1.shareholderName||"")} : undefined,
                shareholderName2: (typeof data.shareholderName2 !== "undefined" && data.shareholderName2) ? {value: data.shareholderName2.id, label: (data.shareholderName2.shareholderName||"")} : undefined,
                shareholderName3: (typeof data.shareholderName3 !== "undefined" && data.shareholderName3) ? {value: data.shareholderName3.id, label: (data.shareholderName3.shareholderName||"")} : undefined,
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const foliosMutateOptions:foliosMutateOptionsType = {
            onSuccess: () => {
                props.type==="Create" && form.reset();
                props.toggleModal({status: false, type: "Create", shareCertificateMasterId: props.mainShareCertificateMasterId});
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
            await updateFolios.mutateAsync(form.values as FolioFormType, foliosMutateOptions);
        }else{
            await addFolios.mutateAsync(form.values as FolioFormType, foliosMutateOptions);
        }
    };

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 1 }}>
                    <TextInput label="Folio" {...form.getInputProps('Folio')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                    <div>
                        <InputLabel>Shareholder Name 1</InputLabel>
                        <ShareHolderSelect 
                            projectId={props.projectId} 
                            value={shareholderSelect.shareholderName1} 
                            setValue={(value) => {form.setFieldValue("shareholderName1ID", value.value); setShareholderSelect({...shareholderSelect, shareholderName1: value})}} 
                        />
                        <InputError>{form.errors.shareholderName1ID}</InputError>
                    </div>
                    <div>
                        <InputLabel>Shareholder Name 2</InputLabel>
                        <ShareHolderSelect 
                            projectId={props.projectId} 
                            value={shareholderSelect.shareholderName2} 
                            setValue={(value) => {form.setFieldValue("shareholderName2ID", value.value); setShareholderSelect({...shareholderSelect, shareholderName2: value})}} 
                        />
                        <InputError>{form.errors.shareholderName2ID}</InputError>
                    </div>
                    <div>
                        <InputLabel>Shareholder Name 3</InputLabel>
                        <ShareHolderSelect 
                            projectId={props.projectId} 
                            value={shareholderSelect.shareholderName3}  
                            setValue={(value) => {form.setFieldValue("shareholderName3ID", value.value); setShareholderSelect({...shareholderSelect, shareholderName3: value})}} 
                        />
                        <InputError>{form.errors.shareholderName3ID}</InputError>
                    </div>
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addFolios.isPending : updateFolios.isPending} disabled={props.type === "Create" ? addFolios.isPending : updateFolios.isPending} data-disabled={props.type === "Create" ? addFolios.isPending : updateFolios.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default FoliosForm