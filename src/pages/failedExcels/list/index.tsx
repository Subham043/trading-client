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
                This page contains the list of all the excels that failed to upload data. You can also view a failed excel by clicking the "Download" button.
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