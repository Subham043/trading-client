import { FC } from "react";
import { Drawer } from '@mantine/core';
import UserForm from "./form";
import { UserDrawerProps } from "../../pages/users";

const UserDrawer:FC<UserDrawerProps & {toggleDrawer: (value: UserDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.status} onClose={() => props.toggleDrawer({status: false, type: 'Create'})} position="right" title={props.type === "Edit" ? "Edit User" : "Create User"} overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <UserForm {...props} toggleDrawer={props.toggleDrawer} />
    </Drawer>)
}

export default UserDrawer;