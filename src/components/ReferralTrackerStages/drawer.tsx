import { FC } from "react";
import { Drawer } from '@mantine/core';
import { ReferralTrackerStagesListDrawerProps } from "../../pages/referralTrackerStages/list";
import ReferralTrackerStageeDetail from "./detail";

const ReferralTrackerStageeDrawer:FC<ReferralTrackerStagesListDrawerProps & {toggleDrawer: (value: ReferralTrackerStagesListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Referral Tracker Stage" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <ReferralTrackerStageeDetail {...props} />
    </Drawer>)
}

export default ReferralTrackerStageeDrawer;