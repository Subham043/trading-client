import { FC } from "react";
import { Drawer } from '@mantine/core';
import { NameChangeMastersListDrawerProps } from "../../pages/nameChangeMasters/list";
import NameChangeMasterDetail from "./detail";

const NameChangeMasterDrawer:FC<NameChangeMastersListDrawerProps & {toggleDrawer: (value: NameChangeMastersListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Name Change Master" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <NameChangeMasterDetail {...props} />
    </Drawer>)
}

export default NameChangeMasterDrawer;