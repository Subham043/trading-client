import { FC } from "react";
import { Drawer } from '@mantine/core';
import { SecurityMastersListDrawerProps } from "../../pages/securityMasters/list";
import SecurityMastersDetail from "./detail";

const SecurityMastersDrawer:FC<SecurityMastersListDrawerProps & {toggleDrawer: (value: SecurityMastersListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Security Masters" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <SecurityMastersDetail {...props} />
    </Drawer>)
}

export default SecurityMastersDrawer;