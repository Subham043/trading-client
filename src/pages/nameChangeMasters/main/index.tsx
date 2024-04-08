import { Paper } from "@mantine/core";
import { FC } from "react";
import classes from './nameChangeMasters.module.css';
import NameChangeMasterMainTable from "../../../components/NameChangeMasters/main-table";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";

const NameChangeMastersMainPage:FC = () => {
    return (
        <div>
            <SearchButtonHeader hasButton={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <NameChangeMasterMainTable />
            </Paper>
        </div>
    )
}

export default NameChangeMastersMainPage;