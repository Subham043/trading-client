import { FC } from "react";
import { Drawer } from '@mantine/core';
import StageNameForm from "./form";
import { StageNamesDrawerProps } from "../../pages/stageNames";

const StageNameDrawer:FC<StageNamesDrawerProps & {toggleDrawer: (value: StageNamesDrawerProps) => void, refetchStageNames?: () => void}> = (props) => {
    return (<Drawer opened={props.status} onClose={() => props.toggleDrawer({status: false, type: 'Create'})} position="right" title={props.type === "Edit" ? "Edit Stage Name" : "Create Stage Name"} overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <StageNameForm {...props} toggleDrawer={props.toggleDrawer} refetchStageNames={props.refetchStageNames} />
    </Drawer>)
}

export default StageNameDrawer;