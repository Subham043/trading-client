import { FC } from "react";
import { Modal } from '@mantine/core';
import ShareCertificateMastersForm from "./form";
import { ShareCertificateMastersListModalProps } from "../../pages/shareCertificateMasters/list";

const ShareCertificateMastersModal:FC<ShareCertificateMastersListModalProps & {toggleModal: (value: ShareCertificateMastersListModalProps) => void, projectId: string}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', projectId: props.projectId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Share Certificate Masters" : "Create Share Certificate Masters"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <ShareCertificateMastersForm {...props} toggleModal={props.toggleModal} projectId={props.projectId} />
        </Modal>
    )
}

export default ShareCertificateMastersModal;