import { FC } from "react";
import { Drawer } from '@mantine/core';
import { StageTrackerDrawerProps } from "../../pages/stageTrackers/list";
import StageTrackerDetail from "./detail";

const StageTrackerDrawer:FC<StageTrackerDrawerProps & {toggleDrawer: (value: StageTrackerDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Stage Tracker" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <StageTrackerDetail {...props} />
    </Drawer>)
}

export default StageTrackerDrawer;