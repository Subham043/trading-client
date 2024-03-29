import { Button, Group, Paper, TextInput, rem } from "@mantine/core";
import { FC, useState } from "react";
import classes from './users.module.css';
import UserTable from "../../components/Users/table";
import { IconSearch } from "@tabler/icons-react";
import UserDrawer from "../../components/Users/drawer";

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