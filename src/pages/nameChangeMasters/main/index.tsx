import { Group, Paper, TextInput, rem } from "@mantine/core";
import { FC } from "react";
import classes from './nameChangeMasters.module.css';
import { IconSearch } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";
import { QueryInitialPageParam, QueryTotalCount } from "../../../utils/constant";
import NameChangeMasterMainTable from "../../../components/NameChangeMasters/main-table";

const NameChangeMastersMainPage:FC = () => {
    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
    const [searchParams, setSearchParams] = useSearchParams();
    const searchHandler = debounce((value: string) => setSearchParams({page: searchParams.get('page') || QueryInitialPageParam.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: value}), 500)

    return (
        <div>
            <Group justify="flex-end" mb="lg">
                <TextInput
                    rightSectionPointerEvents="none"
                    rightSection={icon}
                    placeholder="Search"
                    onChange={(event) => searchHandler(event.target.value)}
                />
            </Group>
            <Paper shadow="sm" className={classes.paper_background}>
                <NameChangeMasterMainTable />
            </Paper>
        </div>
    )
}

export default NameChangeMastersMainPage;