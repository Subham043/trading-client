import { FC } from "react";
import { Modal } from '@mantine/core';
import CertificateForm from "./form";
import { CertificatesListModalProps } from "../../pages/certificates/list";
import { ShareHolderDetailType } from "../../utils/types";

type Props = CertificatesListModalProps & {
    toggleModal: (value: CertificatesListModalProps) => void, 
    mainFolioId: number,
    shareHolder1?: ShareHolderDetailType | null | undefined;
    shareHolder2?: ShareHolderDetailType | null | undefined;
    shareHolder3?: ShareHolderDetailType | null | undefined;
}

const CertificateModal:FC<Props> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', folioId: props.mainFolioId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Certificate" : "Create Certificate"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <CertificateForm {...props} toggleModal={props.toggleModal} shareHolder1={props.shareHolder1} shareHolder2={props.shareHolder2} shareHolder3={props.shareHolder3} />
        </Modal>
    )
}

export default CertificateModal;