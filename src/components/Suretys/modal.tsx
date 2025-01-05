import { FC } from "react";
import { Modal } from '@mantine/core';
import SuretysForm from "./form";
import { SuretysListModalProps } from "../../pages/suretys/list";

const SuretysModal:FC<SuretysListModalProps & {toggleModal: (value: SuretysListModalProps) => void, projectId: string}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', projectId: props.projectId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Surety" : "Create Surety"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <SuretysForm {...props} toggleModal={props.toggleModal} projectId={props.projectId} />
        </Modal>
    )
}

export default SuretysModal;