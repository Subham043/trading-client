import { FC } from "react";
import { Modal } from '@mantine/core';
import CommunicationTrackersForm from "./form";
import { CommunicationTrackersListModalProps } from "../../pages/communicationTrackers/list";

const CommunicationTrackersModal:FC<CommunicationTrackersListModalProps & {toggleModal: (value: CommunicationTrackersListModalProps) => void, projectId: string}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', projectId: props.projectId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Communication Trackers" : "Create Communication Trackers"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <CommunicationTrackersForm {...props} toggleModal={props.toggleModal} projectId={props.projectId} />
        </Modal>
    )
}

export default CommunicationTrackersModal;