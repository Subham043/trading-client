import { FC } from "react";
import { Drawer } from '@mantine/core';
import { LegalHeirDetailsListDrawerProps } from "../../pages/legalHeirDetails/list";
import LegalHeirDetailDetail from "./detail";
import { ShareHolderMasterType } from "../../utils/types";

const LegalHeirDetailDrawer:FC<LegalHeirDetailsListDrawerProps & {toggleDrawer: (value: LegalHeirDetailsListDrawerProps) => void, shareHolderMasterData: ShareHolderMasterType; refetchMasterData: ()=>void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Legal Heir Detail" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <LegalHeirDetailDetail {...props} />
    </Drawer>)
}

export default LegalHeirDetailDrawer;