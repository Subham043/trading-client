import { Button, FileInput, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFileSpreadsheet } from "@tabler/icons-react";
import { yupResolver } from "mantine-form-yup-resolver";
import { FC } from "react";
import * as yup from "yup";

type ExcelUploadModalProps = {
    status: boolean;
    toggleModal: () => void;
    title: string;

}
const schema = yup
  .object({
    file: yup.mixed()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .test('fileFormat', 'Please select a valid excel file', (value:any) => ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(value.type)).required("Please select an excel file"),
  })
  .required();

const ExcelUploadModal:FC<ExcelUploadModalProps> = ({status, toggleModal, title}) => {

    const form = useForm({
        validate: yupResolver(schema),
    });

    const onSubmitHandler = () => {
        console.log(form.values.file);
    }

    return (
        <Modal opened={status} onClose={()=>{toggleModal(); form.reset()}} centered size="sm" withCloseButton={true}  title={title} overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
        }}>
            <form onSubmit={form.onSubmit(onSubmitHandler)}>
                <FileInput
                    label="Select Excel File"
                    placeholder="Excel file"
                    clearable
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    leftSection={<IconFileSpreadsheet size={16} />}
                    {...form.getInputProps('file')}
                />
                <Button type='submit' variant="filled" color='blue' mt="lg">
                    Upload
                </Button>
            </form>
        </Modal>
    )
}

export default ExcelUploadModal;