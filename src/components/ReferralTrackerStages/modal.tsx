import { FC } from "react";
import { Modal } from '@mantine/core';
import ReferralTrackerStageForm from "./form";
import { ReferralTrackerStagesListModalProps } from "../../pages/referralTrackerStages/list";

const ReferralTrackerStageModal:FC<ReferralTrackerStagesListModalProps & {toggleModal: (value: ReferralTrackerStagesListModalProps) => void, mainPaymentTrackerId: number; projectId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', paymentTrackerId: props.mainPaymentTrackerId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Referral Tracker Stage" : "Create Referral Tracker Stage"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <ReferralTrackerStageForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default ReferralTrackerStageModal;