import { FC } from "react";
import { Drawer } from '@mantine/core';
import PincodeForm from "./form";
import { PincodesDrawerProps } from "../../pages/pincodes";

const PincodeDrawer:FC<PincodesDrawerProps & {toggleDrawer: (value: PincodesDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.status} onClose={() => props.toggleDrawer({status: false, type: 'Create'})} position="right" title={props.type === "Edit" ? "Edit Pincode" : "Create Pincode"} overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <PincodeForm {...props} toggleDrawer={props.toggleDrawer} />
    </Drawer>)
}

export default PincodeDrawer;