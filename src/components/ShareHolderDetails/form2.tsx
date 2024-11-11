import { FC, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Button, MultiSelect } from "@mantine/core";
import { isAxiosError } from "axios";
import { AxiosErrorResponseType, ShareHolderMasterType } from "../../utils/types";
import ErrorBoundary from "../Layout/ErrorBoundary"
import * as yup from "yup";
import { useAxios } from "../../hooks/useAxios";
import { api_routes } from "../../utils/api_routes";


type SchemaType = {
  transpositionOrder?: string;
}

const schema: yup.ObjectSchema<SchemaType> = yup.object().shape({
  transpositionOrder: yup.string().trim().optional(),
});

const TranspositionOrderForm:FC<{modal:boolean; mainShareHolderMasterId: number, shareHolderMasterData: ShareHolderMasterType, toggleModal: (value: boolean) => void; refetchMasterData: ()=>void}> = (props) => {

    const {toastError, toastSuccess} = useToast();
    const { axios } = useAxios();
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<SchemaType>({
        initialValues: {
            transpositionOrder: undefined
        },
        validate: yupResolver(schema),
    });
    useEffect(() => {
        if(props.modal){
            form.setValues({
                transpositionOrder: props.shareHolderMasterData.transpositionOrder ? props.shareHolderMasterData.transpositionOrder : undefined
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.modal, props.shareHolderMasterData])

    
    const onSubmit = async () => {
        setLoading(true)
        try {
            await axios.put(
                api_routes.shareHolderMasters + `/transposition/${props.shareHolderMasterData.id}`,
                {
                    ...form.values
                }
            );
            toastSuccess("order saved successfully.")
            props.refetchMasterData()
            props.toggleModal(false)
        } catch (error) {
            if(isAxiosError<AxiosErrorResponseType>(error)){
                if(error?.response?.data?.formErrors){
                    for (const [key, value] of Object.entries(error?.response?.data?.formErrors)) {
                        form.setFieldError(key, value[0]);
                    }
                }else if(error?.response?.data?.message){
                    toastError(error.response.data.message);
                }
            }
        }finally{
            setLoading(false)
        }
    };
    console.log([...new Set(props.shareHolderMasterData.shareHolderDetails.map(item => item.namePan).filter(item => typeof item === "string"))])
    return (
        <ErrorBoundary hasData={true} isLoading={(false)} status={"success"} error={undefined} hasPagination={false} refetch={() => {}}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <MultiSelect
                    label="Order"
                    placeholder="Select the order"
                    maxDropdownHeight={200}
                    data={[...new Set(props.shareHolderMasterData.shareHolderDetails.map(item => item.namePan).filter(item => typeof item === "string"))] as string[]}
                    searchable
                    nothingFoundMessage="Nothing found..."
                    error={form.errors.transpositionOrder}
                    value={form.values.transpositionOrder ? form.values.transpositionOrder.split(",") : undefined}
                    onChange={(value)=>form.setFieldValue('transpositionOrder', value ? value.join(",") : undefined)}
                />
                <Button type='submit' variant="filled" color='blue' mt="lg" loading={loading} disabled={loading} data-disabled={loading}>
                    Save
                </Button>
            </form>
        </ErrorBoundary>
    )
}

export default TranspositionOrderForm