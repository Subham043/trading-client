import { FC } from "react";
import { Modal } from '@mantine/core';
import PaymentTrackersForm from "./form";
import { PaymentTrackersListModalProps } from "../../pages/paymentTrackers/list";

const PaymentTrackersModal:FC<PaymentTrackersListModalProps & {toggleModal: (value: PaymentTrackersListModalProps) => void, projectId: string}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', projectId: props.projectId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Payment Trackers" : "Create Payment Trackers"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <PaymentTrackersForm {...props} toggleModal={props.toggleModal} projectId={props.projectId} />
        </Modal>
    )
}

export default PaymentTrackersModal;