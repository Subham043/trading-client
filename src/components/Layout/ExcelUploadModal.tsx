import { Anchor, Button, FileInput, Modal, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFileSpreadsheet } from "@tabler/icons-react";
import { yupResolver } from "mantine-form-yup-resolver";
import { FC, useState } from "react";
import * as yup from "yup";
import { useAxios } from "../../hooks/useAxios";
import { useToast } from "../../hooks/useToast";
import { isAxiosError } from "axios";
import { AxiosErrorResponseType } from "../../utils/types";

type ExcelUploadModalProps = {
    status: boolean;
    toggleModal: () => void;
    title: string;
    uploadUrl: string;
    sampleUrl: string;

}
const schema = yup
  .object({
    file: yup.mixed()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .test('fileFormat', 'Please select a valid excel file', (value:any) => ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(value.type)).required("Please select an excel file"),
  })
  .required();

const ExcelUploadModal:FC<ExcelUploadModalProps> = ({status, toggleModal, title, uploadUrl, sampleUrl}) => {

    const { axios } = useAxios();
    const [loading, setLoading] = useState<boolean>(false);
    const {toastSuccess, toastError} = useToast();
    const form = useForm({
        validate: yupResolver(schema),
    });

    const onSubmitHandler = async () => {
        setLoading(true);
        try {
            const fileData = form.values.file as File;
            const formData = new FormData();
            formData.append('file', fileData as File, fileData.name);
            await axios.post(uploadUrl, formData);
            toastSuccess(title+' imported successfully. Please refresh the page to see the changes.');
            form.reset();
            toggleModal();
        }catch(error){
            if(isAxiosError<AxiosErrorResponseType>(error)){
                if(error.response?.data.formErrors){
                    form.setFieldError("file", error.response?.data.formErrors.file[0]);
                }else if(error.response?.data.message){
                    toastError(error.response.data.message);
                }
            }else{
                toastError('Something went wrong. Please try again later.');
            }
        }finally{
            setLoading(false);
        }
    }

    return (
        <Modal opened={status} onClose={()=>{toggleModal(); form.reset()}} centered size="sm" withCloseButton={true}  title={'Import '+ title} overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
        }}>
            <form onSubmit={form.onSubmit(onSubmitHandler)}>
                <FileInput
                    label={<Text size="sm">Select Excel File (<Anchor href={sampleUrl} download={true}>Download Sample Excel</Anchor>)</Text>}
                    placeholder="Excel file"
                    clearable
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    leftSection={<IconFileSpreadsheet size={16} />}
                    {...form.getInputProps('file')}
                    disabled={loading}
                />
                <Button type='submit' variant="filled" color='blue' mt="lg" disabled={loading} loading={loading} aria-disabled={loading}>
                    Upload
                </Button>
            </form>
        </Modal>
    )
}

export default ExcelUploadModal;