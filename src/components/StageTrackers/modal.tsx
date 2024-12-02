import { FC } from "react";
import { Modal } from '@mantine/core';
import StageTrackersForm from "./form";
import { StageTrackersListModalProps } from "../../pages/stageTrackers/list";

const StageTrackersModal:FC<StageTrackersListModalProps & {toggleModal: (value: StageTrackersListModalProps) => void, projectId: string}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', projectId: props.projectId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Stage Trackers" : "Create Stage Trackers"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <StageTrackersForm {...props} toggleModal={props.toggleModal} projectId={props.projectId} />
        </Modal>
    )
}

export default StageTrackersModal;