import { Paper } from "@mantine/core";
import { FC } from "react";
import classes from './nameChangeMasters.module.css';
import NameChangeMasterMainTable from "../../../components/NameChangeMasters/main-table";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";

const NameChangeMastersMainPage:FC = () => {
    const { exportExcel, excelLoading } = useExcelExport();
    const exportExcelHandler = async () => await exportExcel(api_routes.nameChangeMasters + '/company/export', 'name_change_masters.xlsx');

    return (
        <div>
            <SearchButtonHeader hasButton={false} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} />
            <Paper shadow="sm" className={classes.paper_background}>
                <NameChangeMasterMainTable />
            </Paper>
        </div>
    )
}

export default NameChangeMastersMainPage;