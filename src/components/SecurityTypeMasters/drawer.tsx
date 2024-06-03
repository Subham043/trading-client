import { FC } from "react";
import { Drawer } from '@mantine/core';
import { SecurityTypeMastersListDrawerProps } from "../../pages/securityTypeMasters/list";
import SecurityTypeMastersDetail from "./detail";

const SecurityTypeMastersDrawer:FC<SecurityTypeMastersListDrawerProps & {toggleDrawer: (value: SecurityTypeMastersListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Security Type Masters" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <SecurityTypeMastersDetail {...props} />
    </Drawer>)
}

export default SecurityTypeMastersDrawer;