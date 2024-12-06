import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './legalHeirDetails.module.css';
import { useParams } from "react-router-dom";
import LegalHeirDetailsTable from "../../../components/LegalHeirDetails/table";
import LegalHeirDetailsModal from "../../../components/LegalHeirDetails/modal";
import LegalHeirDetailsDrawer from "../../../components/LegalHeirDetails/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { LegalHeirDetailsQueryKey } from "../../../hooks/data/legal_heir_details";

export type LegalHeirDetailsListModalProps = {
    status: boolean;
    type: "Create",
    projectId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type LegalHeirDetailsListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const LegalHeirDetailsListPage:FC = () => {
    const param = useParams<{projectId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [modal, setModal] = useState<LegalHeirDetailsListModalProps>({status: false, type: 'Create', projectId: Number(param.projectId)});
    const toggleModal = (value:LegalHeirDetailsListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<LegalHeirDetailsListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:LegalHeirDetailsListDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.legalHeirDetails}/delete-multiple`, 'LegalHeirDetails', [LegalHeirDetailsQueryKey, param.projectId ? Number(param.projectId) : ''], selectedData);
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
                        Legal Heir Details
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                This section contains the list of all the legal heir details which is related to the project mentioned above. You can create a new legal heir details by clicking the "Create" button. You can also export the list of legal heir details to an excel file by clicking the "Export" button. You can also import a list of legal heir details from an excel file by clicking the "Import" button. You can also delete a legal heir details by clicking the "Delete" button.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={true} buttonText={"Create"} buttonClickHandler={() => toggleModal({status: true, type: 'Create', projectId: Number(param.projectId)})} hasExport={false} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <LegalHeirDetailsTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} projectId={Number(param.projectId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <LegalHeirDetailsModal {...modal} mainProjectId={Number(param.projectId)} toggleModal={toggleModal} />
            <LegalHeirDetailsDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default LegalHeirDetailsListPage;