import { FC } from "react";
import { Modal } from '@mantine/core';
import LegalHeirDetailForm from "./form";
import { LegalHeirDetailsListModalProps } from "../../pages/legalHeirDetails/list";
import { ShareHolderMasterType } from "../../utils/types";

const LegalHeirDetailModal:FC<LegalHeirDetailsListModalProps & {toggleModal: (value: LegalHeirDetailsListModalProps) => void, mainShareHolderMasterId: number, shareHolderMasterData: ShareHolderMasterType; refetchMasterData: ()=>void}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', shareHolderMasterId: props.mainShareHolderMasterId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Legal Heir Detail" : "Create Legal Heir Detail"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <LegalHeirDetailForm {...props} shareHolderMasterData={props.shareHolderMasterData} toggleModal={props.toggleModal} refetchMasterData={props.refetchMasterData} />
        </Modal>
    )
}

export default LegalHeirDetailModal;