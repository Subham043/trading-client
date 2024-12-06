import { FC } from "react";
import { Modal } from '@mantine/core';
import IepfTrackersForm from "./form";
import { IepfTrackersListModalProps } from "../../pages/iepfTrackers/list";

const IepfTrackersModal:FC<IepfTrackersListModalProps & {toggleModal: (value: IepfTrackersListModalProps) => void, projectId: string}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', projectId: props.projectId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Iepf Trackers" : "Create Iepf Trackers"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <IepfTrackersForm {...props} toggleModal={props.toggleModal} projectId={props.projectId} />
        </Modal>
    )
}

export default IepfTrackersModal;