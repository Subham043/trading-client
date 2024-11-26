import { FC, useState } from "react";
import PaymentTrackerDetail from "../../../components/PaymentTrackers/detail";
import PaymentTrackerModal from "../../../components/PaymentTrackers/modal";
import { PaymentTrackersListModalProps } from "../list";

const PaymentTrackersDetailPage:FC = () => {
    const [modal, setModal] = useState<PaymentTrackersListModalProps>({status: false, type: 'Create', projectId: ""});
    const toggleModal = (value:PaymentTrackersListModalProps) => setModal(value);

    return (
        <div>
            <PaymentTrackerDetail toggleModal={toggleModal} />
            <PaymentTrackerModal {...modal} toggleModal={toggleModal} projectId="" />
        </div>
    )
}

export default PaymentTrackersDetailPage;