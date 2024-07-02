import { FC } from "react";
import { Modal } from '@mantine/core';
import FolioForm from "./form";
import { FoliosListModalProps } from "../../pages/folios/list";

const FolioModal:FC<FoliosListModalProps & {toggleModal: (value: FoliosListModalProps) => void, mainShareCertificateMasterId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', shareCertificateMasterId: props.mainShareCertificateMasterId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Folio" : "Create Folio"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <FolioForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default FolioModal;