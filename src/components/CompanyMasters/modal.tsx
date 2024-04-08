import { FC } from "react";
import { Modal } from '@mantine/core';
import CompanyMasterForm from "./form";
import { CompanyMastersModalProps } from "../../pages/companyMasters/list";

const CompanyMasterModal:FC<CompanyMastersModalProps & {toggleModal: (value: CompanyMastersModalProps) => void}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create'})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Company Master" : "Create Company Master"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <CompanyMasterForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default CompanyMasterModal;