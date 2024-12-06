import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './nameChangeMasters.module.css';
import NameChangeMasterMainTable from "../../../components/NameChangeMasters/main-table";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";

const NameChangeMastersMainPage:FC = () => {
    const { exportExcel, excelLoading } = useExcelExport();
    const exportExcelHandler = async () => await exportExcel(api_routes.nameChangeMasters + '/company/export', 'name_change_masters.xlsx');
    const [excelModal, setExcelModal] = useState<boolean>(false);
    const toggleExcelModal = () => setExcelModal(prev => !prev);

    return (
        <div>
            <Divider 
                mb="xs" 
                variant="dashed"
                label={
                    <Group justify="center">
                        <Badge variant="filled" size="lg">
                        Name Change Masters
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when
                hunger drives it to try biting a Steel-type Pokémon.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={false} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal} hasDelete={false} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <NameChangeMasterMainTable />
            </Paper>
            <ExcelUploadModal status={excelModal} toggleModal={toggleExcelModal} title="Name Change Masters" uploadUrl={`${api_routes.nameChangeMasters}/import`} sampleUrl="/Sample_Name_Change_Masters.xlsx" />
        </div>
    )
}

export default NameChangeMastersMainPage;