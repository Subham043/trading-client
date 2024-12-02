import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './stageTrackers.module.css';
import StageTrackersTable from "../../../components/StageTrackers/table";
import StageTrackersModal from "../../../components/StageTrackers/modal";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { StageTrackersQueryKey } from "../../../hooks/data/stage_trackers";
import { useParams } from "react-router-dom";
import StageTrackerDrawer from "../../../components/StageTrackers/drawer";

export type StageTrackersListModalProps = {
    status: boolean;
    type: "Create",
    projectId: string
} | {
    status: boolean;
    type: "Edit";
    id: number;
}


export type StageTrackerDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const StageTrackersListPage:FC = () => {
    const param = useParams<{projectId: string}>();
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.stageTrackers + `/export/${param.projectId}`, 'stage_trackers.xlsx');
    const [modal, setModal] = useState<StageTrackersListModalProps>({status: false, type: 'Create', projectId: param.projectId ?? ''});
    const toggleModal = (value:StageTrackersListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<StageTrackerDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:StageTrackerDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.stageTrackers}/delete-multiple`, 'Stage Trackers', StageTrackersQueryKey, selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', projectId: param.projectId ?? ''})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <StageTrackersTable toggleModal={toggleModal} selectedData={selectedData} setSelectedData={setSelectedData} projectId={param.projectId ?? ''} toggleDrawer={toggleDrawer} />
            </Paper>
            <StageTrackerDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
            <StageTrackersModal {...modal} toggleModal={toggleModal} projectId={param.projectId ?? ''} />
        </div>
    )
}

export default StageTrackersListPage;