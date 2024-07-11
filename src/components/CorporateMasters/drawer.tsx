import { FC } from "react";
import { Drawer } from '@mantine/core';
import { CorporateMastersListDrawerProps } from "../../pages/corporateMasters/list";
import CorporayeMasterDetail from "./detail";

const CorporayeMastereDrawer:FC<CorporateMastersListDrawerProps & {toggleDrawer: (value: CorporateMastersListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Corporate Master" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <CorporayeMasterDetail {...props} />
    </Drawer>)
}

export default CorporayeMastereDrawer;