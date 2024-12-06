import { Badge, Button, Divider, Group, Menu, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './registrarMasters.module.css';
import RegistrarMasterTable from "../../../components/RegistrarMasters/table";
import RegistrarMasterModal from "../../../components/RegistrarMasters/modal";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { RegistrarMastersQueryKey } from "../../../hooks/data/registrar_masters";
import { IconPlus } from "@tabler/icons-react";

export type RegistrarMastersModalProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const RegistrarMastersPage:FC = () => {
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const [modal, setModal] = useState<RegistrarMastersModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:RegistrarMastersModalProps) => setModal(value);
    const exportExcelHandler = async () => await exportExcel(api_routes.registrarMasters + '/export', 'registrar_masters.xlsx');
    const [excelModal, setExcelModal] = useState<boolean>(false);
    const toggleExcelModal = () => setExcelModal(prev => !prev);
    const [excelModal2, setExcelModal2] = useState<boolean>(false);
    const toggleExcelModal2 = () => setExcelModal2(prev => !prev);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.registrarMasters}/delete-multiple`, 'Registrar Masters', RegistrarMastersQueryKey, selectedData);
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
                        Registrar Masters
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                This page contains the list of all the registrar masters. Each registrar master is associated with a branch. You can create a new registrar master by clicking the "Create" button. You can also export the list of registrar masters to an excel file by clicking the "Export" button. You can also import a list of registrar masters from an excel file by clicking the "Import" button. You can also delete a registrar master by clicking the "Delete" button. Branches can be monitored by clicking the "View" button.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create'})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={true} multipleButtons={
                <Menu shadow="md" width={200} trigger="hover">
                    <Menu.Target>
                        <Button variant="filled" color='grape'>Import</Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item onClick={toggleExcelModal} leftSection={<IconPlus size={14} />}>
                            Registrar Master
                        </Menu.Item>
                        <Menu.Item onClick={toggleExcelModal2} leftSection={<IconPlus size={14} />}>
                            Registrar Branch
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            } />
            <Paper shadow="sm" className={classes.paper_background}>
                <RegistrarMasterTable toggleModal={toggleModal} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <RegistrarMasterModal {...modal} toggleModal={toggleModal} />
            <ExcelUploadModal status={excelModal} toggleModal={toggleExcelModal} title="Registrar Masters" uploadUrl={`${api_routes.registrarMasters}/import`} sampleUrl="/Sample_Registrar_Masters.xlsx" />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Registrar Master Branches" uploadUrl={`${api_routes.registrarMasterBranches}/import`} sampleUrl="/Sample_Registrar_Master_Branches.xlsx" />
        </div>
    )
}

export default RegistrarMastersPage;