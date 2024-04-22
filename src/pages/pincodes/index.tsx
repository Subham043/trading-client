import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './pincodes.module.css';
import PincodesTable from "../../components/Pincodes/table";
import PincodesDrawer from "../../components/Pincodes/drawer";
import SearchButtonHeader from "../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../utils/api_routes";
import { useExcelExport } from "../../hooks/useExcelExport";

export type PincodesDrawerProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const PincodesPage:FC = () => {
    const { exportExcel, excelLoading } = useExcelExport();
    const [drawer, setDrawer] = useState<PincodesDrawerProps>({status: false, type: 'Create'});
    const toggleDrawer = (value:PincodesDrawerProps) => setDrawer(value);

    const exportExcelHandler = async () => await exportExcel(api_routes.pincodes + '/export', 'pincodes.xlsx');

    return (
        <div>
            <SearchButtonHeader hasButton={true} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasSearch={true} buttonText="Create" buttonClickHandler={() => toggleDrawer({status: true, type: 'Create'})} hasImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <PincodesTable toggleDrawer={toggleDrawer} />
            </Paper>
            <PincodesDrawer {...drawer} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default PincodesPage;