import { FC } from "react";
import { Drawer } from '@mantine/core';
import UserForm from "./form";
import { DrawerProps } from "../../pages/users";

const UserDrawer:FC<DrawerProps & {toggleDrawer: (value: DrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.status} onClose={() => props.toggleDrawer({status: false, type: 'Create'})} position="right" title={props.type === "Edit" ? "Edit User" : "Create User"} overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <UserForm {...props} />
    </Drawer>)
}

export default UserDrawer;