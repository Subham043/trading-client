import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './companyMasters.module.css';
import CompanyMasterTable from "../../../components/CompanyMasters/table";
import CompanyMasterModal from "../../../components/CompanyMasters/modal";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";

export type CompanyMastersModalProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const CompanyMastersPage:FC = () => {
    const { exportExcel, excelLoading } = useExcelExport();
    const [modal, setModal] = useState<CompanyMastersModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:CompanyMastersModalProps) => setModal(value);
    const exportExcelHandler = async () => await exportExcel(api_routes.companyMasters + '/export', 'company_masters.xlsx');

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create'})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} />
            <Paper shadow="sm" className={classes.paper_background}>
                <CompanyMasterTable toggleModal={toggleModal} />
            </Paper>
            <CompanyMasterModal {...modal} toggleModal={toggleModal} />
        </div>
    )
}

export default CompanyMastersPage;