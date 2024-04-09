import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './users.module.css';
import UserTable from "../../components/Users/table";
import UserDrawer from "../../components/Users/drawer";
import SearchButtonHeader from "../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../utils/api_routes";
import { useExcelExport } from "../../hooks/useExcelExport";

export type UserDrawerProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const UsersPage:FC = () => {
    const { exportExcel, excelLoading } = useExcelExport();
    const [drawer, setDrawer] = useState<UserDrawerProps>({status: false, type: 'Create'});
    const toggleDrawer = (value:UserDrawerProps) => setDrawer(value);
    const exportExcelHandler = async () => await exportExcel(api_routes.users + '/export', 'users.xlsx');

    return (
        <div>
            <SearchButtonHeader hasButton={true} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasSearch={true} buttonText="Create" buttonClickHandler={() => toggleDrawer({status: true, type: 'Create'})} />
            <Paper shadow="sm" className={classes.paper_background}>
                <UserTable toggleDrawer={toggleDrawer} />
            </Paper>
            <UserDrawer {...drawer} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default UsersPage;