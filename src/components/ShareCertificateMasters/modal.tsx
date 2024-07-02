import { FC } from "react";
import { Modal } from '@mantine/core';
import ShareCertificateMastersForm from "./form";
import { ShareCertificateMastersListModalProps } from "../../pages/shareCertificateMasters/list";

const ShareCertificateMastersModal:FC<ShareCertificateMastersListModalProps & {toggleModal: (value: ShareCertificateMastersListModalProps) => void}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create'})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Share Certificate Masters" : "Create Share Certificate Masters"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <ShareCertificateMastersForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default ShareCertificateMastersModal;