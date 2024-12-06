import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './paymentTrackers.module.css';
import PaymentTrackersTable from "../../../components/PaymentTrackers/table";
import PaymentTrackersModal from "../../../components/PaymentTrackers/modal";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { PaymentTrackersQueryKey } from "../../../hooks/data/payment_trackers";
import { useParams } from "react-router-dom";

export type PaymentTrackersListModalProps = {
    status: boolean;
    type: "Create",
    projectId: string
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const PaymentTrackersListPage:FC = () => {
    const param = useParams<{projectId: string}>();
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.paymentTrackers + `/export/${param.projectId}`, 'payment_trackers.xlsx');
    const [modal, setModal] = useState<PaymentTrackersListModalProps>({status: false, type: 'Create', projectId: param.projectId ?? ''});
    const toggleModal = (value:PaymentTrackersListModalProps) => setModal(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.paymentTrackers}/delete-multiple`, 'Payment Trackers', PaymentTrackersQueryKey, selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <Divider 
                mb="xs" 
                variant="dashed"
                label={
                    <Group justify="center">
                        <Badge variant="filled" size="lg">
                        Payment Trackers
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                This page contains the list of all the payment trackers. Each payment tracker is associated with a payment tracker stages & referral tracker stages. You can create a new payment tracker by clicking the "Create" button. You can also export the list of payment trackers to an excel file by clicking the "Export" button. You can also import a list of payment trackers from an excel file by clicking the "Import" button. You can also delete a payment tracker by clicking the "Delete" button. Payment tracker stages & referral tracker stages can be monitored by clicking the "View" button.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', projectId: param.projectId ?? ''})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <PaymentTrackersTable toggleModal={toggleModal} selectedData={selectedData} setSelectedData={setSelectedData} projectId={param.projectId ?? ''} />
            </Paper>
            <PaymentTrackersModal {...modal} toggleModal={toggleModal} projectId={param.projectId ?? ''} />
        </div>
    )
}

export default PaymentTrackersListPage;