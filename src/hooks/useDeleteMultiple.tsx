import { useState } from 'react';
import { useAxios } from './useAxios';
import { useToast } from './useToast';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { QueryInitialPageParam, QueryTotalCount } from '../utils/constant';
import { isAxiosError } from 'axios';

/*
  * Toast Hook Type
*/
type DeleteMultipleHookType = () => {
    deleteLoading: boolean;
    deleteMultiple:  (url: string, key: string, query_key: string|unknown[], selectedData: number[]) => Promise<void>;
}


/*
  Toast Hook Function: This hook is used to have common toast configs at one place
*/
export const useDeleteMultiple:DeleteMultipleHookType = () => {

    const { axios } = useAxios();
    const {toastError, toastSuccess} = useToast();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const page = searchParams.get("page") || QueryInitialPageParam.toString();
    const limit = searchParams.get("limit") || QueryTotalCount.toString();
    const search = searchParams.get("search") || "";
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const deleteMultiple = async (url: string, key: string, query_key: string|unknown[], selectedData: number[]) => {
        if(selectedData.length > 0) {
            setDeleteLoading(true);
            try {
                await axios.post(url, {id: selectedData});
                if(Array.isArray(query_key)){
                    queryClient.invalidateQueries({queryKey: [...query_key, page, limit, search]});
                }else{
                    queryClient.invalidateQueries({queryKey: [query_key, page, limit, search]});
                }
                toastSuccess(key+" deleted successfully.");
            } catch (error) {
                if (isAxiosError<{message: string}>(error)) {
                    toastError(error.response!.data.message);
                }else{
                    toastError("Something went wrong. Please try again later.");
                }
            }finally {
                setDeleteLoading(false);
            }
        }
    }

    return {
        deleteMultiple,
        deleteLoading
    };
}