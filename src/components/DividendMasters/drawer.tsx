import { FC } from "react";
import { Drawer } from '@mantine/core';
import { DividendMastersListDrawerProps } from "../../pages/dividendMasters/list";
import DividendMasterDetail from "./detail";

const DividendMastereDrawer:FC<DividendMastersListDrawerProps & {toggleDrawer: (value: DividendMastersListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Dividend Master" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <DividendMasterDetail {...props} />
    </Drawer>)
}

export default DividendMastereDrawer;