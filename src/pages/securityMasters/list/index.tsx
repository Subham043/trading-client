import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './securityMasters.module.css';
import SecurityMastersTable from "../../../components/SecurityMasters/table";
import SecurityMastersModal from "../../../components/SecurityMasters/modal";
import SecurityMastersDrawer from "../../../components/SecurityMasters/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { SecurityMastersQueryKey } from "../../../hooks/data/security_masters";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";

export type SecurityMastersListModalProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type SecurityMastersListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const SecurityMastersListPage:FC = () => {
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.securityMasters + `/export`, 'security_masters.xlsx');
    const [modal, setModal] = useState<SecurityMastersListModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:SecurityMastersListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<SecurityMastersListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:SecurityMastersListDrawerProps) => setDrawerStatus(value);
    const [excelModal2, setExcelModal2] = useState<boolean>(false);
    const toggleExcelModal2 = () => setExcelModal2(prev => !prev);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.securityMasters}/delete-multiple`, 'Security Masters', SecurityMastersQueryKey, selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create'})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal2} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <SecurityMastersTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <SecurityMastersModal {...modal} toggleModal={toggleModal} />
            <SecurityMastersDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Security Masters" uploadUrl={`${api_routes.securityMasters}/import`} sampleUrl="/Sample_Security_Masters.xlsx" />
        </div>
    )
}

export default SecurityMastersListPage;