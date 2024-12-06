import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './paymentTrackerStages.module.css';
import { useParams } from "react-router-dom";
import PaymentTrackerStagesTable from "../../../components/PaymentTrackerStages/table";
import PaymentTrackerStagesModal from "../../../components/PaymentTrackerStages/modal";
import PaymentTrackerStagesDrawer from "../../../components/PaymentTrackerStages/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { PaymentTrackerStagesQueryKey } from "../../../hooks/data/payment_tracker_stages";

export type PaymentTrackerStagesListModalProps = {
    status: boolean;
    type: "Create",
    paymentTrackerId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type PaymentTrackerStagesCorporateMasterModalProps = {
    status: false;
} | {
    status: true;
    id: number;
}

export type PaymentTrackerStagesDividendMasterModalProps = {
    status: false;
} | {
    status: true;
    id: number;
}

export type PaymentTrackerStagesListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const PaymentTrackerStagesListPage:FC<{projectId: number}> = ({projectId}) => {
    const param = useParams<{paymentTrackerId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.paymentTrackerStages + `/export/${param.paymentTrackerId}`, 'paymentTrackerStages.xlsx');
    const [modal, setModal] = useState<PaymentTrackerStagesListModalProps>({status: false, type: 'Create', paymentTrackerId: Number(param.paymentTrackerId)});
    const toggleModal = (value:PaymentTrackerStagesListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<PaymentTrackerStagesListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:PaymentTrackerStagesListDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.paymentTrackerStages}/delete-multiple`, 'PaymentTrackerStages', [PaymentTrackerStagesQueryKey, param.paymentTrackerId ? Number(param.paymentTrackerId) : ''], selectedData);
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
                        Payment Tracker Stages
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when
                hunger drives it to try biting a Steel-type Pokémon.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', paymentTrackerId: Number(param.paymentTrackerId)})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <PaymentTrackerStagesTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} paymentTrackerId={Number(param.paymentTrackerId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <PaymentTrackerStagesModal {...modal} mainPaymentTrackerId={Number(param.paymentTrackerId)} toggleModal={toggleModal} projectId={projectId} />
            <PaymentTrackerStagesDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default PaymentTrackerStagesListPage;