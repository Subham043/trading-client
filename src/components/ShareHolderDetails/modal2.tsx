import { FC } from "react";
import { Modal } from '@mantine/core';
import { ShareHolderMasterType } from "../../utils/types";
import TranspositionOrderForm from "./form2";

const TranspositionOrderModal:FC<{modal:boolean; toggleModal: (value: boolean) => void, mainShareHolderMasterId: number, shareHolderMasterData: ShareHolderMasterType; refetchMasterData: ()=>void}> = (props) => {
    return (
        <Modal opened={props.modal} onClose={() => props.toggleModal(false)} centered size="sm" withCloseButton={true}  title={"Transposition Order"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <TranspositionOrderForm {...props} shareHolderMasterData={props.shareHolderMasterData} toggleModal={props.toggleModal} refetchMasterData={props.refetchMasterData} />
        </Modal>
    )
}

export default TranspositionOrderModal;