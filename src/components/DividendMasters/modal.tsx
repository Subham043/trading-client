import { FC } from "react";
import { Modal } from '@mantine/core';
import DividendMasterForm from "./form";
import { DividendMastersListModalProps } from "../../pages/dividendMasters/list";

const DividendMasterModal:FC<DividendMastersListModalProps & {toggleModal: (value: DividendMastersListModalProps) => void, mainCompanyId: number}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create', companyId: props.mainCompanyId})} centered size="xl" withCloseButton={true}  title={props.type === "Edit" ? "Edit Dividend Master" : "Create Dividend Master"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <DividendMasterForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default DividendMasterModal;