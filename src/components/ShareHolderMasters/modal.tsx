import { FC } from "react";
import { Modal } from '@mantine/core';
import ShareHolderMastersForm from "./form";
import { ShareHolderMastersListModalProps } from "../../pages/shareHolderMasters/list";

const ShareHolderMastersModal:FC<ShareHolderMastersListModalProps & {toggleModal: (value: ShareHolderMastersListModalProps) => void, projectId: string}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', projectId: props.projectId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Share Holder Masters" : "Create Share Holder Masters"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <ShareHolderMastersForm {...props} toggleModal={props.toggleModal} projectId={props.projectId} />
        </Modal>
    )
}

export default ShareHolderMastersModal;