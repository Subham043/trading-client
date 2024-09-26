import { FC, useState } from "react";
import ShareHolderMasterDetail from "../../../components/ShareHolderMasters/detail";
import ShareHolderMasterModal from "../../../components/ShareHolderMasters/modal";
import { ShareHolderMastersListModalProps } from "../list";

const ShareHolderMastersDetailPage:FC = () => {
    const [modal, setModal] = useState<ShareHolderMastersListModalProps>({status: false, type: 'Create', projectId: ""});
    const toggleModal = (value:ShareHolderMastersListModalProps) => setModal(value);

    return (
        <div>
            <ShareHolderMasterDetail toggleModal={toggleModal} />
            <ShareHolderMasterModal {...modal} toggleModal={toggleModal} projectId="" />
        </div>
    )
}

export default ShareHolderMastersDetailPage;