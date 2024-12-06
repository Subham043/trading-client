import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC } from "react";
import classes from './failedExcel.module.css';
import FailedExcelTable from "../../../components/FailedExcels/table";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";

const FailedExcelsPage:FC = () => {

    return (
        <div>
            <Divider 
                mb="xs" 
                variant="dashed"
                label={
                    <Group justify="center">
                        <Badge variant="filled" size="lg">
                        Failed Excels
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
            <SearchButtonHeader hasButton={false} hasExport={false} hasImport={false} hasDelete={false} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <FailedExcelTable />
            </Paper>
        </div>
    )
}

export default FailedExcelsPage;