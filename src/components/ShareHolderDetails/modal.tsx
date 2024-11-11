import { FC } from "react";
import { Modal } from '@mantine/core';
import ShareHolderDetailForm from "./form";
import { ShareHolderDetailsListModalProps } from "../../pages/shareHolderDetails/list";

const ShareHolderDetailModal:FC<ShareHolderDetailsListModalProps & {toggleModal: (value: ShareHolderDetailsListModalProps) => void, mainProjectId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', projectId: props.mainProjectId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Share Holder Detail" : "Create Share Holder Detail"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <ShareHolderDetailForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default ShareHolderDetailModal;