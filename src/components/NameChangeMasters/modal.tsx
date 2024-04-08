import { FC } from "react";
import { Modal } from '@mantine/core';
import NameChangeMasterForm from "./form";
import { NameChangeMastersListModalProps } from "../../pages/nameChangeMasters/list";

const NameChangeMasterModal:FC<NameChangeMastersListModalProps & {toggleModal: (value: NameChangeMastersListModalProps) => void, mainCompanyId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', companyId: props.mainCompanyId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Name Change Master" : "Change Name Change Master"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <NameChangeMasterForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default NameChangeMasterModal;