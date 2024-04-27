import { Paper } from "@mantine/core";
import { FC } from "react";
import classes from './failedExcel.module.css';
import FailedExcelTable from "../../../components/FailedExcels/table";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";

const FailedExcelsPage:FC = () => {

    return (
        <div>
            <SearchButtonHeader hasButton={false} hasExport={false} hasImport={false} hasDelete={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <FailedExcelTable />
            </Paper>
        </div>
    )
}

export default FailedExcelsPage;