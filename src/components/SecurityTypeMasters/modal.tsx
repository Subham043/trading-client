import { FC } from "react";
import { Modal } from '@mantine/core';
import SecurityTypeMastersForm from "./form";
import { SecurityTypeMastersListModalProps } from "../../pages/securityTypeMasters/list";

const SecurityTypeMastersModal:FC<SecurityTypeMastersListModalProps & {toggleModal: (value: SecurityTypeMastersListModalProps) => void}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create'})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Security Type Masters" : "Create Security Type Masters"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <SecurityTypeMastersForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default SecurityTypeMastersModal;