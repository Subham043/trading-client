import { FC } from "react";
import { Drawer } from '@mantine/core';
import { CasesListDrawerProps } from "../../pages/cases/list";
import CaseDetail from "./detail";

const CaseDrawer:FC<CasesListDrawerProps & {toggleDrawer: (value: CasesListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Case" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <CaseDetail {...props} />
    </Drawer>)
}

export default CaseDrawer;