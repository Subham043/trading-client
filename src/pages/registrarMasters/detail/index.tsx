import { FC, useState } from "react";
import RegistrarMasterDetail from "../../../components/RegistrarMasters/detail";
import RegistrarMasterModal from "../../../components/RegistrarMasters/modal";
import { RegistrarMastersModalProps } from "../list";

const RegistrarMastersDetailPage:FC = () => {
    const [modal, setModal] = useState<RegistrarMastersModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:RegistrarMastersModalProps) => setModal(value);

    return (
        <div>
            <RegistrarMasterDetail toggleModal={toggleModal} />
            <RegistrarMasterModal {...modal} toggleModal={toggleModal} />
        </div>
    )
}

export default RegistrarMastersDetailPage;