import { FC } from "react";
import { Drawer } from '@mantine/core';
import { ShareHolderDetailsListDrawerProps } from "../../pages/shareHolderDetails/list";
import ShareHolderDetaileDetail from "./detail";

const ShareHolderDetaileDrawer:FC<ShareHolderDetailsListDrawerProps & {toggleDrawer: (value: ShareHolderDetailsListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Share Holder Detail" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <ShareHolderDetaileDetail {...props} />
    </Drawer>)
}

export default ShareHolderDetaileDrawer;