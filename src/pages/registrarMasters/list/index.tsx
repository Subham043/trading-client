import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './registrarMasters.module.css';
import RegistrarMasterTable from "../../../components/RegistrarMasters/table";
import RegistrarMasterModal from "../../../components/RegistrarMasters/modal";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";
import RegistrarMasterDrawer from "../../../components/RegistrarMasters/drawer";

export type RegistrarMastersModalProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type RegistrarMastersListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const RegistrarMastersPage:FC = () => {
    const { exportExcel, excelLoading } = useExcelExport();
    const [modal, setModal] = useState<RegistrarMastersModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:RegistrarMastersModalProps) => setModal(value);
    const exportExcelHandler = async () => await exportExcel(api_routes.registrarMasters + '/export', 'registrar_masters.xlsx');
    const [excelModal, setExcelModal] = useState<boolean>(false);
    const toggleExcelModal = () => setExcelModal(prev => !prev);
    const [drawerStatus, setDrawerStatus] = useState<RegistrarMastersListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:RegistrarMastersListDrawerProps) => setDrawerStatus(value);

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create'})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal} />
            <Paper shadow="sm" className={classes.paper_background}>
                <RegistrarMasterTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} />
            </Paper>
            <RegistrarMasterModal {...modal} toggleModal={toggleModal} />
            <RegistrarMasterDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
            <ExcelUploadModal status={excelModal} toggleModal={toggleExcelModal} title="Registrar Masters" uploadUrl={`${api_routes.registrarMasters}/import`} sampleUrl="/Sample_Registrar_Masters.xlsx" />
        </div>
    )
}

export default RegistrarMastersPage;