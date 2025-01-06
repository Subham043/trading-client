import { FC } from "react";
import { Modal } from '@mantine/core';
import CertificateForm from "./form";
import { CertificatesListModalProps } from "../../pages/certificates/list";

const CertificateModal:FC<CertificatesListModalProps & {toggleModal: (value: CertificatesListModalProps) => void, mainFolioId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', folioId: props.mainFolioId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Certificate" : "Create Certificate"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <CertificateForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default CertificateModal;