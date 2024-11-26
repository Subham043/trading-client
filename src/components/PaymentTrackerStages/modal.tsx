import { FC } from "react";
import { Modal } from '@mantine/core';
import PaymentTrackerStageForm from "./form";
import { PaymentTrackerStagesListModalProps } from "../../pages/paymentTrackerStages/list";

const PaymentTrackerStageModal:FC<PaymentTrackerStagesListModalProps & {toggleModal: (value: PaymentTrackerStagesListModalProps) => void, mainPaymentTrackerId: number; projectId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', paymentTrackerId: props.mainPaymentTrackerId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Payment Tracker Stage" : "Create Payment Tracker Stage"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <PaymentTrackerStageForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default PaymentTrackerStageModal;