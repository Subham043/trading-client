import { FC } from "react";
import { Drawer } from '@mantine/core';
import { LegalHeirDetailsListDrawerProps } from "../../pages/legalHeirDetails/list";
import LegalHeirDetaileDetail from "./detail";

const LegalHeirDetaileDrawer:FC<LegalHeirDetailsListDrawerProps & {toggleDrawer: (value: LegalHeirDetailsListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Legal Heir Detail" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <LegalHeirDetaileDetail {...props} />
    </Drawer>)
}

export default LegalHeirDetaileDrawer;