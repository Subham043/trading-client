import { FC } from "react";
import { Modal } from '@mantine/core';
import CasesForm from "./form";
import { CasesListModalProps } from "../../pages/cases/list";

const CasesModal:FC<CasesListModalProps & {toggleModal: (value: CasesListModalProps) => void, shareCertificateId: number, projectId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', shareCertificateId: props.shareCertificateId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Cases" : "Create Cases"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <CasesForm {...props} toggleModal={props.toggleModal} shareCertificateId={props.shareCertificateId} />
        </Modal>
    )
}

export default CasesModal;