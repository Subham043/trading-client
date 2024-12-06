import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './shareHolderDetails.module.css';
import { useParams } from "react-router-dom";
import ShareHolderDetailsTable from "../../../components/ShareHolderDetails/table";
import ShareHolderDetailsModal from "../../../components/ShareHolderDetails/modal";
import ShareHolderDetailsDrawer from "../../../components/ShareHolderDetails/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { ShareHolderDetailsQueryKey } from "../../../hooks/data/share_holder_details";

export type ShareHolderDetailsListModalProps = {
    status: boolean;
    type: "Create",
    projectId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type ShareHolderDetailsListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const ShareHolderDetailsListPage:FC = () => {
    const param = useParams<{projectId: string}>()
    const [shareHolderCount, setShareHolderCount] = useState<number>(0)
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [modal, setModal] = useState<ShareHolderDetailsListModalProps>({status: false, type: 'Create', projectId: Number(param.projectId)});
    const toggleModal = (value:ShareHolderDetailsListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<ShareHolderDetailsListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:ShareHolderDetailsListDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.shareHolderDetails}/delete-multiple`, 'ShareHolderDetails', [ShareHolderDetailsQueryKey, param.projectId ? Number(param.projectId) : ''], selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <Divider 
                mb="xs" 
                variant="dashed"
                label={
                    <Group justify="center">
                        <Badge variant="filled" size="lg">
                        Share Holder Details
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                This section contains the list of all the share holder details which is related to the project mentioned above. You can create a new share holder details by clicking the "Create" button. You can also export the list of share holder details to an excel file by clicking the "Export" button. You can also import a list of share holder details from an excel file by clicking the "Import" button. You can also delete a share holder details by clicking the "Delete" button.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={shareHolderCount>2 ? false : true} buttonText={"Create"} buttonClickHandler={() => toggleModal({status: true, type: 'Create', projectId: Number(param.projectId)})} hasExport={false} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <ShareHolderDetailsTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} projectId={Number(param.projectId)} selectedData={selectedData} setSelectedData={setSelectedData} setShareHolderCount={setShareHolderCount} />
            </Paper>
            <ShareHolderDetailsModal {...modal} mainProjectId={Number(param.projectId)} toggleModal={toggleModal} />
            <ShareHolderDetailsDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default ShareHolderDetailsListPage;