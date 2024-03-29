import { FC } from "react";
import { Drawer } from '@mantine/core';
import UserForm from "./form";

type UserDrawerProps = {
    opened: boolean;
    close: () => void;
}

const UserDrawer:FC<UserDrawerProps> = ({opened, close}) => {
    return (<Drawer opened={opened} onClose={close} position="right" title="Create User" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <UserForm />
    </Drawer>)
}

export default UserDrawer;