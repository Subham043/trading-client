import { FC } from "react";
import { Modal } from '@mantine/core';
import RegistrarMasterForm from "./form";
import { RegistrarMastersModalProps } from "../../pages/registrarMasters/list";

const RegistrarMasterModal:FC<RegistrarMastersModalProps & {toggleModal: (value: RegistrarMastersModalProps) => void}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create'})} centered size="sm" withCloseButton={true}  title={props.type === "Edit" ? "Edit Registrar Master" : "Create Registrar Master"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <RegistrarMasterForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default RegistrarMasterModal;