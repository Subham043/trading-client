import { Badge, Button, Divider, Group, Menu, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './companyMasters.module.css';
import CompanyMasterTable from "../../../components/CompanyMasters/table";
import CompanyMasterModal from "../../../components/CompanyMasters/modal";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { CompanyMastersQueryKey } from "../../../hooks/data/company_masters";
import { IconEdit, IconPlus } from "@tabler/icons-react";

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
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const [modal, setModal] = useState<CompanyMastersModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:CompanyMastersModalProps) => setModal(value);
    const exportExcelHandler = async () => await exportExcel(api_routes.companyMasters + '/export', 'company_masters.xlsx');
    const [excelModal, setExcelModal] = useState<boolean>(false);
    const toggleExcelModal = () => setExcelModal(prev => !prev);
    const [excelModal2, setExcelModal2] = useState<boolean>(false);
    const toggleExcelModal2 = () => setExcelModal2(prev => !prev);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.companyMasters}/delete-multiple`, 'Company Masters', CompanyMastersQueryKey, selectedData);
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
                        Company Masters
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                This page contains the list of all the company masters. Each company master is associated with a name change master, corporate master & dividend master. You can create a new company master by clicking the "Create" button. You can also export the list of company masters to an excel file by clicking the "Export" button. You can also import a list of company masters from an excel file by clicking the "Import" button. You can also delete a company master by clicking the "Delete" button. Name change master, corporate master & dividend master can be monitored by clicking the "View" button.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create'})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={true} multipleButtons={
                <Menu shadow="md" width={100} trigger="hover">
                    <Menu.Target>
                        <Button variant="filled" color='grape'>Import</Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item onClick={toggleExcelModal} leftSection={<IconPlus size={14} />}>
                            Insert
                        </Menu.Item>
                        <Menu.Item onClick={toggleExcelModal2} leftSection={<IconEdit size={14} />}>
                            Update
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            }/>
            <Paper shadow="sm" className={classes.paper_background}>
                <CompanyMasterTable toggleModal={toggleModal} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <CompanyMasterModal {...modal} toggleModal={toggleModal} />
            <ExcelUploadModal status={excelModal} toggleModal={toggleExcelModal} title="Company Masters Insert" uploadUrl={`${api_routes.companyMasters}/import`} sampleUrl="/Sample_Company_Masters.xlsx" />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Company Masters Update" uploadUrl={`${api_routes.companyMasters}/import-update`} sampleUrl="/Sample_Company_Masters_Update.xlsx" />
        </div>
    )
}

export default CompanyMastersPage;