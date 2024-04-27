import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './nameChangeMasters.module.css';
import { useParams } from "react-router-dom";
import NameChangeMasterTable from "../../../components/NameChangeMasters/table";
import NameChangeMasterModal from "../../../components/NameChangeMasters/modal";
import NameChangeMasterDrawer from "../../../components/NameChangeMasters/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { NameChangeMastersQueryKey } from "../../../hooks/data/name_change_masters";

export type NameChangeMastersListModalProps = {
    status: boolean;
    type: "Create",
    companyId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type NameChangeMastersListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const NameChangeMastersListPage:FC = () => {
    const param = useParams<{companyId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.nameChangeMasters + `/list/export/${param.companyId}`, 'name_change_masters.xlsx');
    const [modal, setModal] = useState<NameChangeMastersListModalProps>({status: false, type: 'Create', companyId: Number(param.companyId)});
    const toggleModal = (value:NameChangeMastersListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<NameChangeMastersListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:NameChangeMastersListDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.nameChangeMasters}/delete-multiple/${param.companyId}`, 'Name Change Masters', [NameChangeMastersQueryKey, param.companyId ? Number(param.companyId) : ''], selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Change" buttonClickHandler={() => toggleModal({status: true, type: 'Create', companyId: Number(param.companyId)})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} />
            <Paper shadow="sm" className={classes.paper_background}>
                <NameChangeMasterTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} companyId={Number(param.companyId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <NameChangeMasterModal {...modal} mainCompanyId={Number(param.companyId)} toggleModal={toggleModal} />
            <NameChangeMasterDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default NameChangeMastersListPage;