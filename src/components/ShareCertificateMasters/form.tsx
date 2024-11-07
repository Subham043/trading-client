import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, Select, SimpleGrid } from "@mantine/core";
import { isAxiosError } from "axios";
import { useAddShareCertificateMasterMutation, useShareCertificateMasterQuery, useUpdateShareCertificateMasterMutation } from "../../hooks/data/share_certificate_masters";
import { MutateOptions } from "@tanstack/react-query";
import { AxiosErrorResponseType, ShareCertificateMasterFormType, ShareCertificateMasterType } from "../../utils/types";
import { ShareCertificateMastersListModalProps } from "../../pages/shareCertificateMasters/list";
import { SchemaType, initialValues, schema } from "./schema";
import ErrorBoundary from "../Layout/ErrorBoundary";
import debounce from "lodash.debounce";
import { useCompanyMastersSelectQuery } from "../../hooks/data/company_masters";


type ShareCertificateMastersFormProps = {
    status: boolean;
    type: "Create",
    projectId: string;
} | {
    status: boolean;
    type: "Edit";
    id: number;
    projectId: string;
}
type shareCertificateMastersMutateOptionsType = MutateOptions<ShareCertificateMasterType, Error, ShareCertificateMasterFormType, unknown>;

const ShareCertificateMastersForm:FC<ShareCertificateMastersFormProps & {toggleModal: (value: ShareCertificateMastersListModalProps) => void}> = (props) => {

    const {toastError} = useToast();
    const [search, setSearch] = useState<string>("");
    const searchHandler = debounce((value: string) => setSearch(value), 500);
    const {data:companyMasters, isFetching:isCompanyFetching, isLoading:isCompanyLoading} = useCompanyMastersSelectQuery({search: search, enabled:props.status});
    const {data, isFetching, isLoading, status, error,  refetch} = useShareCertificateMasterQuery(props.type === "Edit" ? props.id : 0, (props.type === "Edit" && props.status && props.id>0));
    const addShareCertificateMasters = useAddShareCertificateMasterMutation(props.projectId)
    const updateShareCertificateMasters = useUpdateShareCertificateMasterMutation(props.type === "Edit" ? props.id : 0, (data && data.projectID) ? data.projectID.toString() : '')
    const form = useForm<SchemaType>({
        initialValues,
        validate: yupResolver(schema),
    });
    
    useEffect(() => {
        if(props.type === "Edit" && data && props.status){
            setSearch((data.companyMaster && data.companyMaster.currentNameChangeMasters && data.companyMaster.currentNameChangeMasters.currentName) ? data.companyMaster.currentNameChangeMasters.currentName.toString() : "");
            form.setValues({
                instrumentType: data.instrumentType ? data.instrumentType : undefined,
                companyID: data.companyID ? data.companyID : undefined,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, props.type, props.status]);
    
    const onSubmit = async () => {
        const shareCertificateMastersMutateOptions:shareCertificateMastersMutateOptionsType = {
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
            await updateShareCertificateMasters.mutateAsync(form.values as ShareCertificateMasterFormType, shareCertificateMastersMutateOptions);
        }else{
            await addShareCertificateMasters.mutateAsync(form.values as ShareCertificateMasterFormType, shareCertificateMastersMutateOptions);
        }
    };

    const onSelectHandler = (value: string | null) => {
        form.setFieldValue('companyID', value ? Number(value) : undefined)
        if(companyMasters){
            const companySelectedData = companyMasters.companyMaster.find((companyMaster) => companyMaster.id.toString() === value);
            if(companySelectedData){
                form.setFieldValue('state', companySelectedData.id);
            }
        }
    }

    return (
        <ErrorBoundary hasData={props.status && props.type==="Edit" ? (data ? true : false): true} isLoading={props.status && props.type==="Edit" ? (isLoading || isFetching) : (false)} status={props.status && props.type==="Edit" ? status : "success"} error={props.status && props.type==="Edit" ? error : undefined} hasPagination={false} refetch={props.status && props.type==="Edit" ? refetch : () => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Select
                        label="Instrument Type"
                        withAsterisk
                        data={["InvIT" , "IDR" , "MFs" , "PreferenceShares" , "REiT" , "Equity" , "Warrant"]}
                        value={form.values.instrumentType ? form.values.instrumentType : null}
                        onChange={(value) => form.setFieldValue("instrumentType", value ? value as "InvIT" | "IDR" | "MFs" | "PreferenceShares" | "REiT" | "Equity" | "Warrant" : "InvIT")}
                    />
                    <Select
                        label="Company Name"
                        placeholder="Type to search for company"
                        maxDropdownHeight={200}
                        data={companyMasters ? companyMasters.companyMaster.map((item) => ({label: item.currentNameChangeMasters ? item.currentNameChangeMasters.currentName + " - " + item.id.toString() : item.id.toString(), value: item.id ? item.id.toString() : ""})) : []}
                        searchable
                        clearable
                        withAsterisk
                        nothingFoundMessage="Nothing found..."
                        disabled={isCompanyFetching || isCompanyLoading}
                        error={form.errors.companyID}
                        value={form.values.companyID ? form.values.companyID.toString() : undefined}
                        onChange={onSelectHandler}
                        onSearchChange={searchHandler}
                    />
                </SimpleGrid>
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={props.type === "Create" ? addShareCertificateMasters.isPending : updateShareCertificateMasters.isPending} disabled={props.type === "Create" ? addShareCertificateMasters.isPending : updateShareCertificateMasters.isPending} data-disabled={props.type === "Create" ? addShareCertificateMasters.isPending : updateShareCertificateMasters.isPending}>
                    {props.type === "Create" ? "Create" : "Update"}
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default ShareCertificateMastersForm