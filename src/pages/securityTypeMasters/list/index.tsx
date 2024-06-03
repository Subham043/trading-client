import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './securityTypeMasters.module.css';
import SecurityTypeMastersTable from "../../../components/SecurityTypeMasters/table";
import SecurityTypeMastersModal from "../../../components/SecurityTypeMasters/modal";
import SecurityTypeMastersDrawer from "../../../components/SecurityTypeMasters/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { SecurityTypeMastersQueryKey } from "../../../hooks/data/security_type_masters";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";

export type SecurityTypeMastersListModalProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type SecurityTypeMastersListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const SecurityTypeMastersListPage:FC = () => {
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.securityTypeMasters + `/export`, 'security_type_masters.xlsx');
    const [modal, setModal] = useState<SecurityTypeMastersListModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:SecurityTypeMastersListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<SecurityTypeMastersListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:SecurityTypeMastersListDrawerProps) => setDrawerStatus(value);
    const [excelModal2, setExcelModal2] = useState<boolean>(false);
    const toggleExcelModal2 = () => setExcelModal2(prev => !prev);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.securityTypeMasters}/delete-multiple`, 'Security Type Masters', SecurityTypeMastersQueryKey, selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create'})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal2} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <SecurityTypeMastersTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <SecurityTypeMastersModal {...modal} toggleModal={toggleModal} />
            <SecurityTypeMastersDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Security Type Masters" uploadUrl={`${api_routes.securityTypeMasters}/import`} sampleUrl="/Sample_Security_Type_Masters.xlsx" />
        </div>
    )
}

export default SecurityTypeMastersListPage;