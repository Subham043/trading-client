import { FC } from "react";
import { Drawer } from '@mantine/core';
import { PaymentTrackerStagesListDrawerProps } from "../../pages/paymentTrackerStages/list";
import PaymentTrackerStageeDetail from "./detail";

const PaymentTrackerStageeDrawer:FC<PaymentTrackerStagesListDrawerProps & {toggleDrawer: (value: PaymentTrackerStagesListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Payment Tracker Stage" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <PaymentTrackerStageeDetail {...props} />
    </Drawer>)
}

export default PaymentTrackerStageeDrawer;