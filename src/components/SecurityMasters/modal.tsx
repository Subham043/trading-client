import { FC } from "react";
import { Modal } from '@mantine/core';
import SecurityMastersForm from "./form";
import { SecurityMastersListModalProps } from "../../pages/securityMasters/list";

const SecurityMastersModal:FC<SecurityMastersListModalProps & {toggleModal: (value: SecurityMastersListModalProps) => void}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create'})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Security Masters" : "Create Security Masters"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <SecurityMastersForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default SecurityMastersModal;