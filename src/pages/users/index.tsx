import { Button, Group, Paper, TextInput, rem } from "@mantine/core";
import { FC } from "react";
import classes from './users.module.css';
import UserTable from "../../components/Users/table";
import { IconSearch } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import UserDrawer from "../../components/Users/drawer";

const UsersPage:FC = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
    return (
        <div>
            <Group justify="space-between" mb="lg">
                <Button type='submit' variant="filled" color='blue' onClick={open}>
                    Create
                </Button>
                <TextInput
                    rightSectionPointerEvents="none"
                    rightSection={icon}
                    placeholder="Search"
                />
            </Group>
            <Paper shadow="sm" className={classes.paper_background}>
                <UserTable />
            </Paper>
            <UserDrawer opened={opened} close={close} />
        </div>
    )
}

export default UsersPage;