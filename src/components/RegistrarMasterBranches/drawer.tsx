import { FC } from "react";
import { Drawer } from '@mantine/core';
import { RegistrarMasterBranchesListDrawerProps } from "../../pages/registrarMasterBranches/list";
import RegistrarMasterBrancheDetail from "./detail";

const RegistrarMasterBrancheDrawer:FC<RegistrarMasterBranchesListDrawerProps & {toggleDrawer: (value: RegistrarMasterBranchesListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Registrar Master Branch" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <RegistrarMasterBrancheDetail {...props} />
    </Drawer>)
}

export default RegistrarMasterBrancheDrawer;