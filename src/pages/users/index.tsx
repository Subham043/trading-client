import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './users.module.css';
import UserTable from "../../components/Users/table";
import UserDrawer from "../../components/Users/drawer";
import SearchButtonHeader from "../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../utils/api_routes";
import { useExcelExport } from "../../hooks/useExcelExport";
import ExcelUploadModal from "../../components/Layout/ExcelUploadModal";
import { UsersQueryKey } from "../../hooks/data/users";
import { useDeleteMultiple } from "../../hooks/useDeleteMultiple";

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
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [drawer, setDrawer] = useState<UserDrawerProps>({status: false, type: 'Create'});
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const toggleDrawer = (value:UserDrawerProps) => setDrawer(value);
    const [excelModal, setExcelModal] = useState<boolean>(false);
    const toggleExcelModal = () => setExcelModal(prev => !prev);
    const exportExcelHandler = async () => await exportExcel(api_routes.users + '/export', 'users.xlsx');

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.users}/delete-multiple`, 'Users', UsersQueryKey, selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <Divider 
                mb="xs" 
                variant="dashed"
                label={
                    <Group justify="center">
                        <Badge variant="filled" size="lg">
                        Users
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                This page contains the list of all the users who have access to the portal. You can create a new users by clicking the "Create" button. You can also export the list of users to an excel file by clicking the "Export" button. You can also import a list of users from an excel file by clicking the "Import" button. You can also delete a users by clicking the "Delete" button.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />

            <SearchButtonHeader hasButton={true} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasSearch={true} buttonText="Create" buttonClickHandler={() => toggleDrawer({status: true, type: 'Create'})} hasImport={true} importClickHandler={toggleExcelModal} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <UserTable toggleDrawer={toggleDrawer} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <UserDrawer {...drawer} toggleDrawer={toggleDrawer} />
            <ExcelUploadModal status={excelModal} toggleModal={toggleExcelModal} title="Users" uploadUrl={`${api_routes.users}/import`} sampleUrl="/Sample_Users.xlsx" />
        </div>
    )
}

export default UsersPage;