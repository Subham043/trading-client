import { useState } from 'react';
import { useAxios } from './useAxios';
import { useToast } from './useToast';
import { useSearchParams } from 'react-router-dom';

/*
  * Toast Hook Type
*/
type ExcelExportHookType = () => {
    excelLoading: boolean;
    exportExcel:  (excel_url: string, excel_file_name: string) => Promise<void>;
}


/*
  Toast Hook Function: This hook is used to have common toast configs at one place
*/
export const useExcelExport:ExcelExportHookType = () => {

    const { axios } = useAxios();
    const {toastError, toastSuccess} = useToast();
    const [searchParams] = useSearchParams();
    const [excelLoading, setExcelLoading] = useState<boolean>(false);
    const exportExcel = async (excel_url: string, excel_file_name: string) => {
        try {
            const search = searchParams.get("search") || "";
            const response = await axios.get(`${excel_url}?search=${search}`, {responseType: 'blob'});
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', excel_file_name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toastSuccess('Excel Exported Successfully');
        } catch (error) {
            toastError('Something went wrong. Please try again later.');
        }finally{
            setExcelLoading(false);
        }
    }

    return {
        exportExcel,
        excelLoading
    };
}