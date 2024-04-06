import { FC } from "react";
import { Modal } from '@mantine/core';
import NameChangeMasterForm from "./form";
import { ModalProps } from "../../pages/nameChangeMasters/list";

const NameChangeMasterModal:FC<ModalProps & {toggleModal: (value: ModalProps) => void, mainCompanyId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', companyId: props.mainCompanyId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Name Change Master" : "Create Name Change Master"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <NameChangeMasterForm {...props} />
        </Modal>
    )
}

export default NameChangeMasterModal;