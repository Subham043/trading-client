import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './referralTrackerStages.module.css';
import { useParams } from "react-router-dom";
import ReferralTrackerStagesTable from "../../../components/ReferralTrackerStages/table";
import ReferralTrackerStagesModal from "../../../components/ReferralTrackerStages/modal";
import ReferralTrackerStagesDrawer from "../../../components/ReferralTrackerStages/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { ReferralTrackerStagesQueryKey } from "../../../hooks/data/referral_tracker_stages";

export type ReferralTrackerStagesListModalProps = {
    status: boolean;
    type: "Create",
    paymentTrackerId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type ReferralTrackerStagesCorporateMasterModalProps = {
    status: false;
} | {
    status: true;
    id: number;
}

export type ReferralTrackerStagesDividendMasterModalProps = {
    status: false;
} | {
    status: true;
    id: number;
}

export type ReferralTrackerStagesListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const ReferralTrackerStagesListPage:FC<{projectId: number}> = ({projectId}) => {
    const param = useParams<{paymentTrackerId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.referralTrackerStages + `/export/${param.paymentTrackerId}`, 'referralTrackerStages.xlsx');
    const [modal, setModal] = useState<ReferralTrackerStagesListModalProps>({status: false, type: 'Create', paymentTrackerId: Number(param.paymentTrackerId)});
    const toggleModal = (value:ReferralTrackerStagesListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<ReferralTrackerStagesListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:ReferralTrackerStagesListDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.referralTrackerStages}/delete-multiple`, 'ReferralTrackerStages', [ReferralTrackerStagesQueryKey, param.paymentTrackerId ? Number(param.paymentTrackerId) : ''], selectedData);
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
                        Referral Tracker Stages
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                This section contains the list of all the referral tracker stages which is related to the payment tracker mentioned above. You can create a new referral tracker stages by clicking the "Create" button. You can also export the list of referral tracker stages to an excel file by clicking the "Export" button. You can also import a list of referral tracker stages from an excel file by clicking the "Import" button. You can also delete a referral tracker stages by clicking the "Delete" button.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', paymentTrackerId: Number(param.paymentTrackerId)})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <ReferralTrackerStagesTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} paymentTrackerId={Number(param.paymentTrackerId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <ReferralTrackerStagesModal {...modal} mainPaymentTrackerId={Number(param.paymentTrackerId)} toggleModal={toggleModal} projectId={projectId} />
            <ReferralTrackerStagesDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default ReferralTrackerStagesListPage;