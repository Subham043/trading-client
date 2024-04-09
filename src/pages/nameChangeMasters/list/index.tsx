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
    const { exportExcel, excelLoading } = useExcelExport();
    const exportExcelHandler = async () => await exportExcel(api_routes.nameChangeMasters + '/export', 'name_change_masters.xlsx');
    const [modal, setModal] = useState<NameChangeMastersListModalProps>({status: false, type: 'Create', companyId: Number(param.companyId)});
    const toggleModal = (value:NameChangeMastersListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<NameChangeMastersListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:NameChangeMastersListDrawerProps) => setDrawerStatus(value);

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Change" buttonClickHandler={() => toggleModal({status: true, type: 'Create', companyId: Number(param.companyId)})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} />
            <Paper shadow="sm" className={classes.paper_background}>
                <NameChangeMasterTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} companyId={Number(param.companyId)} />
            </Paper>
            <NameChangeMasterModal {...modal} mainCompanyId={Number(param.companyId)} toggleModal={toggleModal} />
            <NameChangeMasterDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default NameChangeMastersListPage;