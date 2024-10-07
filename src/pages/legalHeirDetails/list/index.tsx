import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './legalHeirDetails.module.css';
import { useParams } from "react-router-dom";
import LegalHeirDetailsTable from "../../../components/LegalHeirDetails/table";
import LegalHeirDetailsModal from "../../../components/LegalHeirDetails/modal";
import LegalHeirDetailsDrawer from "../../../components/LegalHeirDetails/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { LegalHeirDetailsQueryKey } from "../../../hooks/data/legal_heir_details";
import { ShareHolderMasterType } from "../../../utils/types";

export type LegalHeirDetailsListModalProps = {
    status: boolean;
    type: "Create",
    shareHolderMasterId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type LegalHeirDetailsListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const LegalHeirDetailsListPage:FC<{shareHolderMasterData: ShareHolderMasterType; refetchMasterData: ()=>void}> = ({shareHolderMasterData, refetchMasterData}) => {
    const param = useParams<{shareHolderMasterId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [modal, setModal] = useState<LegalHeirDetailsListModalProps>({status: false, type: 'Create', shareHolderMasterId: Number(param.shareHolderMasterId)});
    const toggleModal = (value:LegalHeirDetailsListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<LegalHeirDetailsListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:LegalHeirDetailsListDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.legalHeirDetails}/delete-multiple`, 'LegalHeirDetails', [LegalHeirDetailsQueryKey, param.shareHolderMasterId ? Number(param.shareHolderMasterId) : ''], selectedData);
            refetchMasterData()
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={shareHolderMasterData.legalHeirDetails.length<Number(shareHolderMasterData.noOfLegalHeir)} buttonText={"Create"} buttonClickHandler={() => toggleModal({status: true, type: 'Create', shareHolderMasterId: Number(param.shareHolderMasterId)})} hasExport={false} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <LegalHeirDetailsTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} shareHolderMasterId={Number(param.shareHolderMasterId)} selectedData={selectedData} setSelectedData={setSelectedData} refetchMasterData={refetchMasterData} />
            </Paper>
            <LegalHeirDetailsModal {...modal} mainShareHolderMasterId={Number(param.shareHolderMasterId)} shareHolderMasterData={shareHolderMasterData} toggleModal={toggleModal} refetchMasterData={refetchMasterData} />
            <LegalHeirDetailsDrawer {...drawerStatus} toggleDrawer={toggleDrawer} shareHolderMasterData={shareHolderMasterData} refetchMasterData={refetchMasterData} />
        </div>
    )
}

export default LegalHeirDetailsListPage;