import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './registrarMasterBranches.module.css';
import { useParams } from "react-router-dom";
import RegistrarMasterBranchesTable from "../../../components/RegistrarMasterBranches/table";
import RegistrarMasterBranchesModal from "../../../components/RegistrarMasterBranches/modal";
import RegistrarMasterBranchesDrawer from "../../../components/RegistrarMasterBranches/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { RegistrarMasterBranchesQueryKey } from "../../../hooks/data/registrar_master_branches";

export type RegistrarMasterBranchesListModalProps = {
    status: boolean;
    type: "Create",
    registrarMasterId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type RegistrarMasterBranchesListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const RegistrarMasterBranchesListPage:FC = () => {
    const param = useParams<{registrarMasterId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.registrarMasterBranches + `/export/${param.registrarMasterId}`, 'registrar_master_branches.xlsx');
    const [modal, setModal] = useState<RegistrarMasterBranchesListModalProps>({status: false, type: 'Create', registrarMasterId: Number(param.registrarMasterId)});
    const toggleModal = (value:RegistrarMasterBranchesListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<RegistrarMasterBranchesListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:RegistrarMasterBranchesListDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.registrarMasterBranches}/delete-multiple`, 'Registrar Master Branches', [RegistrarMasterBranchesQueryKey, param.registrarMasterId ? Number(param.registrarMasterId) : ''], selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', registrarMasterId: Number(param.registrarMasterId)})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} />
            <Paper shadow="sm" className={classes.paper_background}>
                <RegistrarMasterBranchesTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} registrarMasterId={Number(param.registrarMasterId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <RegistrarMasterBranchesModal {...modal} mainRegistrarMasterId={Number(param.registrarMasterId)} toggleModal={toggleModal} />
            <RegistrarMasterBranchesDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default RegistrarMasterBranchesListPage;