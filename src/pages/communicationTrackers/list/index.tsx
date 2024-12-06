import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './communicationTrackers.module.css';
import CommunicationTrackersTable from "../../../components/CommunicationTrackers/table";
import CommunicationTrackersModal from "../../../components/CommunicationTrackers/modal";
import CommunicationTrackerDrawer from "../../../components/CommunicationTrackers/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { CommunicationTrackersQueryKey } from "../../../hooks/data/communication_trackers";
import { useParams } from "react-router-dom";

export type CommunicationTrackersListModalProps = {
    status: boolean;
    type: "Create",
    projectId: string
} | {
    status: boolean;
    type: "Edit";
    id: number;
}


export type CommunicationTrackerDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const CommunicationTrackersListPage:FC = () => {
    const param = useParams<{projectId: string}>();
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.communicationTrackers + `/export/${param.projectId}`, 'communication_trackers.xlsx');
    const [modal, setModal] = useState<CommunicationTrackersListModalProps>({status: false, type: 'Create', projectId: param.projectId ?? ''});
    const toggleModal = (value:CommunicationTrackersListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<CommunicationTrackerDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:CommunicationTrackerDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.communicationTrackers}/delete-multiple`, 'Communication Trackers', CommunicationTrackersQueryKey, selectedData);
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
                        Communication Trackers
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                This section contains the list of all the communication trackers which is related to the project mentioned above. You can create a new communication trackers by clicking the "Create" button. You can also export the list of communication trackers to an excel file by clicking the "Export" button. You can also import a list of communication trackers from an excel file by clicking the "Import" button. You can also delete a communication trackers by clicking the "Delete" button.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', projectId: param.projectId ?? ''})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <CommunicationTrackersTable toggleModal={toggleModal} selectedData={selectedData} setSelectedData={setSelectedData} projectId={param.projectId ?? ''} toggleDrawer={toggleDrawer} />
            </Paper>
            <CommunicationTrackerDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
            <CommunicationTrackersModal {...modal} toggleModal={toggleModal} projectId={param.projectId ?? ''} />
        </div>
    )
}

export default CommunicationTrackersListPage;