import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './shareHolderDetails.module.css';
import { useParams } from "react-router-dom";
import ShareHolderDetailsTable from "../../../components/ShareHolderDetails/table";
import ShareHolderDetailsModal from "../../../components/ShareHolderDetails/modal";
import ShareHolderDetailsDrawer from "../../../components/ShareHolderDetails/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { ShareHolderDetailsQueryKey } from "../../../hooks/data/share_holder_details";
import { ShareHolderMasterType } from "../../../utils/types";

export type ShareHolderDetailsListModalProps = {
    status: boolean;
    type: "Create",
    shareHolderMasterId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type ShareHolderDetailsListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const ShareHolderDetailsListPage:FC<{shareHolderMasterData: ShareHolderMasterType}> = ({shareHolderMasterData}) => {
    const param = useParams<{shareHolderMasterId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [modal, setModal] = useState<ShareHolderDetailsListModalProps>({status: false, type: 'Create', shareHolderMasterId: Number(param.shareHolderMasterId)});
    const toggleModal = (value:ShareHolderDetailsListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<ShareHolderDetailsListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:ShareHolderDetailsListDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.shareHolderDetails}/delete-multiple`, 'ShareHolderDetails', [ShareHolderDetailsQueryKey, param.shareHolderMasterId ? Number(param.shareHolderMasterId) : ''], selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', shareHolderMasterId: Number(param.shareHolderMasterId)})} hasExport={false} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <ShareHolderDetailsTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} shareHolderMasterId={Number(param.shareHolderMasterId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <ShareHolderDetailsModal {...modal} mainShareHolderMasterId={Number(param.shareHolderMasterId)} shareHolderMasterData={shareHolderMasterData} toggleModal={toggleModal} />
            <ShareHolderDetailsDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default ShareHolderDetailsListPage;