import { FC } from "react";
import { Modal } from '@mantine/core';
import NominationsForm from "./form";
import { NominationsListModalProps } from "../../pages/nominations/list";

const NominationsModal:FC<NominationsListModalProps & {toggleModal: (value: NominationsListModalProps) => void, projectId: string}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', projectId: props.projectId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Nomination" : "Create Nomination"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <NominationsForm {...props} toggleModal={props.toggleModal} projectId={props.projectId} />
        </Modal>
    )
}

export default NominationsModal;