import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './stageNames.module.css';
import StageNamesTable from "../../components/StageNames/table";
import StageNamesDrawer from "../../components/StageNames/drawer";
import SearchButtonHeader from "../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../utils/api_routes";
import { useExcelExport } from "../../hooks/useExcelExport";
import { useDeleteMultiple } from "../../hooks/useDeleteMultiple";
import { StageNamesQueryKey } from "../../hooks/data/stage_names";

export type StageNamesDrawerProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const StageNamesPage:FC = () => {
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const [drawer, setDrawer] = useState<StageNamesDrawerProps>({status: false, type: 'Create'});
    const toggleDrawer = (value:StageNamesDrawerProps) => setDrawer(value);

    const exportExcelHandler = async () => await exportExcel(api_routes.stageNames + '/export', 'stageNames.xlsx');

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.stageNames}/delete-multiple`, 'StageNames', StageNamesQueryKey, selectedData);
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
                        Stage Names
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
            <SearchButtonHeader hasButton={true} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasSearch={true} buttonText="Create" buttonClickHandler={() => toggleDrawer({status: true, type: 'Create'})} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <StageNamesTable toggleDrawer={toggleDrawer} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <StageNamesDrawer {...drawer} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default StageNamesPage;