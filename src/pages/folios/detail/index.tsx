import { FC, useState } from "react";
import FolioDetailPage from "../../../components/Folios/detailPage";
import FolioModal from "../../../components/Folios/modal";
import { FoliosListModalProps } from "../list";

const FoliosDetailPage:FC = () => {
    const [modal, setModal] = useState<FoliosListModalProps>({status: false, type: 'Create', shareCertificateMasterId: 0});
    const toggleModal = (value:FoliosListModalProps) => setModal(value);

    return (
        <div>
            <FolioDetailPage toggleModal={toggleModal} />
            <FolioModal {...modal} toggleModal={toggleModal} mainShareCertificateMasterId={0} projectId={0} />
        </div>
    )
}

export default FoliosDetailPage;