import { FC } from "react";
import { Drawer } from '@mantine/core';
import { FoliosListDrawerProps } from "../../pages/folios/list";
import FolioeDetail from "./detail";

const FolioeDrawer:FC<FoliosListDrawerProps & {toggleDrawer: (value: FoliosListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Registrar Master Branch" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <FolioeDetail {...props} />
    </Drawer>)
}

export default FolioeDrawer;