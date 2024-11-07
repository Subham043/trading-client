import { FC } from "react";
import { Modal } from '@mantine/core';
import LegalHeirDetailForm from "./form";
import { LegalHeirDetailsListModalProps } from "../../pages/legalHeirDetails/list";

const LegalHeirDetailModal:FC<LegalHeirDetailsListModalProps & {toggleModal: (value: LegalHeirDetailsListModalProps) => void, mainProjectId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', projectId: props.mainProjectId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Legal Heir Detail" : "Create Legal Heir Detail"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <LegalHeirDetailForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default LegalHeirDetailModal;