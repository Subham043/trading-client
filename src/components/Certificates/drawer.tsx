import { FC } from "react";
import { Drawer } from '@mantine/core';
import { CertificatesListDrawerProps } from "../../pages/certificates/list";
import CertificateeDetail from "./detail";

const CertificateeDrawer:FC<CertificatesListDrawerProps & {toggleDrawer: (value: CertificatesListDrawerProps) => void}> = (props) => {
    return (<Drawer opened={props.drawerStatus} onClose={() => props.toggleDrawer({drawerStatus: false})} position="right" title="Certificate" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
        <CertificateeDetail {...props} />
    </Drawer>)
}

export default CertificateeDrawer;