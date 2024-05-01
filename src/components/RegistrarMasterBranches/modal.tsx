import { FC } from "react";
import { Modal } from '@mantine/core';
import RegistrarMasterBranchForm from "./form";
import { RegistrarMasterBranchesListModalProps } from "../../pages/registrarMasterBranches/list";

const RegistrarMasterBranchModal:FC<RegistrarMasterBranchesListModalProps & {toggleModal: (value: RegistrarMasterBranchesListModalProps) => void, mainRegistrarMasterId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', registrarMasterId: props.mainRegistrarMasterId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Registrar Master Branch" : "Create Registrar Master Branch"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <RegistrarMasterBranchForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default RegistrarMasterBranchModal;