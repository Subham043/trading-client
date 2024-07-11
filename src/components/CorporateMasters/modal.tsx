import { FC } from "react";
import { Modal } from '@mantine/core';
import CorporateMasterForm from "./form";
import { CorporateMastersListModalProps } from "../../pages/corporateMasters/list";

const CorporateMasterModal:FC<CorporateMastersListModalProps & {toggleModal: (value: CorporateMastersListModalProps) => void, mainCompanyId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', companyId: props.mainCompanyId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Corporate Master" : "Create Corporate Master"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <CorporateMasterForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default CorporateMasterModal;