import { FC } from "react";
import { Modal } from '@mantine/core';
import CompanyMasterForm from "./form";
import { ModalProps } from "../../pages/companyMasters/list";

const CompanyMasterModal:FC<ModalProps & {toggleModal: (value: ModalProps) => void}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create'})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Company Master" : "Create Company Master"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <CompanyMasterForm {...props} />
        </Modal>
    )
}

export default CompanyMasterModal;