import { Button, Group, Paper, TextInput, rem } from "@mantine/core";
import { FC, useState } from "react";
import classes from './users.module.css';
import UserTable from "../../components/Users/table";
import { IconSearch } from "@tabler/icons-react";
import UserDrawer from "../../components/Users/drawer";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";

export type DrawerProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const UsersPage:FC = () => {
    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
    const [drawer, setDrawer] = useState<DrawerProps>({status: false, type: 'Create'});
    const toggleDrawer = (value:DrawerProps) => setDrawer(value);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchHandler = debounce((value: string) => setSearchParams({page: searchParams.get('page') || QueryInitialPageParam.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: value}), 500)

    return (
        <div>
            <Group justify="space-between" mb="lg">
                <Button type='submit' variant="filled" color='blue' onClick={() => toggleDrawer({status: true, type: 'Create'})}>
                    Create
                </Button>
                <TextInput
                    rightSectionPointerEvents="none"
                    rightSection={icon}
                    placeholder="Search"
                    onChange={(event) => searchHandler(event.target.value)}
                />
            </Group>
            <Paper shadow="sm" className={classes.paper_background}>
                <UserTable toggleDrawer={toggleDrawer} />
            </Paper>
            <UserDrawer {...drawer} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default UsersPage;