import { FC } from "react";
import { Drawer } from '@mantine/core';
import { CommunicationTrackerDrawerProps } from "../../pages/communicationTrackers/list";
import CommunicationTrackerDetail from "./detail";

const CommunicationTrackerDrawer:FC<CommunicationTrackerDrawerProps & {toggleDrawer: (value: CommunicationTrackerDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Communication Tracker" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <CommunicationTrackerDetail {...props} />
    </Drawer>)
}

export default CommunicationTrackerDrawer;