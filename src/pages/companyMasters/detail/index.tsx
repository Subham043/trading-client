import { FC, useState } from "react";
import CompanyMasterModal from "../../../components/CompanyMasters/modal";
import CompanyMasterDetail from "../../../components/CompanyMasters/detail";

export type CompanyMastersDetailModalProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const CompanyMastersDetailPage:FC = () => {
    const [modal, setModal] = useState<CompanyMastersDetailModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:CompanyMastersDetailModalProps) => setModal(value);

    return (
        <div>
            <CompanyMasterDetail toggleModal={toggleModal} />
            <CompanyMasterModal {...modal} toggleModal={toggleModal} />
        </div>
    )
}

export default CompanyMastersDetailPage;