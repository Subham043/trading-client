import { FC } from "react";
import { Drawer } from '@mantine/core';
import { RegistrarMastersListDrawerProps } from "../../pages/registrarMasters/list";
import RegistrarMasterDetail from "./detail";

const RegistrarMasterDrawer:FC<RegistrarMastersListDrawerProps & {toggleDrawer: (value: RegistrarMastersListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Registrar Master" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <RegistrarMasterDetail {...props} />
    </Drawer>)
}

export default RegistrarMasterDrawer;