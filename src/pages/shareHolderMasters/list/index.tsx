import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './shareHolderDetails.module.css';
import ShareHolderMastersTable from "../../../components/ShareHolderMasters/table";
import ShareHolderMastersModal from "../../../components/ShareHolderMasters/modal";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../../utils/api_routes";
import { useParams } from "react-router-dom";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { ShareHolderMastersQueryKey } from "../../../hooks/data/share_holder_masters";

export type ShareHolderMastersListModalProps = {
    status: boolean;
    type: "Create",
    projectId: string
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const ShareHolderMastersListPage:FC = () => {
    const param = useParams<{projectId: string}>();
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [modal, setModal] = useState<ShareHolderMastersListModalProps>({status: false, type: 'Create', projectId: param.projectId ?? ''});
    const toggleModal = (value:ShareHolderMastersListModalProps) => setModal(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.shareCertificateMasters}/delete-multiple`, 'Share Certificate Masters', ShareHolderMastersQueryKey, selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', projectId: param.projectId ?? ''})} hasExport={false} hasImport={false} hasDelete={selectedData.length>0} deleteLoading={deleteLoading} deleteClickHandler={deleteMultipleHandler} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <ShareHolderMastersTable toggleModal={toggleModal} selectedData={selectedData} setSelectedData={setSelectedData} projectId={param.projectId ?? ''} />
            </Paper>
            <ShareHolderMastersModal {...modal} toggleModal={toggleModal} projectId={param.projectId ?? ''} />
        </div>
    )
}

export default ShareHolderMastersListPage;