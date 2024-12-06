import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './pincodes.module.css';
import PincodesTable from "../../components/Pincodes/table";
import PincodesDrawer from "../../components/Pincodes/drawer";
import SearchButtonHeader from "../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../utils/api_routes";
import { useExcelExport } from "../../hooks/useExcelExport";
import { useDeleteMultiple } from "../../hooks/useDeleteMultiple";
import { PincodesQueryKey } from "../../hooks/data/pincodes";

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
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const [drawer, setDrawer] = useState<PincodesDrawerProps>({status: false, type: 'Create'});
    const toggleDrawer = (value:PincodesDrawerProps) => setDrawer(value);

    const exportExcelHandler = async () => await exportExcel(api_routes.pincodes + '/export', 'pincodes.xlsx');

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.pincodes}/delete-multiple`, 'Pincodes', PincodesQueryKey, selectedData);
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
                        Pincodes
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
                <PincodesTable toggleDrawer={toggleDrawer} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <PincodesDrawer {...drawer} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default PincodesPage;