import { FC, useState } from "react";
import ShareCertificateMasterDetail from "../../../components/ShareCertificateMasters/detail";
import ShareCertificateMasterModal from "../../../components/ShareCertificateMasters/modal";
import { ShareCertificateMastersListModalProps } from "../list";

const ShareCertificateMastersDetailPage:FC = () => {
    const [modal, setModal] = useState<ShareCertificateMastersListModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:ShareCertificateMastersListModalProps) => setModal(value);

    return (
        <div>
            <ShareCertificateMasterDetail toggleModal={toggleModal} />
            <ShareCertificateMasterModal {...modal} toggleModal={toggleModal} />
        </div>
    )
}

export default ShareCertificateMastersDetailPage;