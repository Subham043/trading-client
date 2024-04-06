import { FC } from "react";
import { Drawer } from '@mantine/core';
import { DrawerProps } from "../../pages/nameChangeMasters/list";
import NameChangeMasterDetail from "./detail";

const NameChangeMasterDrawer:FC<DrawerProps & {toggleDrawer: (value: DrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Name Change Master" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <NameChangeMasterDetail {...props} />
    </Drawer>)
}

export default NameChangeMasterDrawer;