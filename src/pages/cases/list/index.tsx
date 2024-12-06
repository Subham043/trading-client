import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './cases.module.css';
import CasesTable from "../../../components/Cases/table";
import CasesModal from "../../../components/Cases/modal";
import CasesDrawer from "../../../components/Cases/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { CasesQueryKey } from "../../../hooks/data/cases";

export type CasesListModalProps = {
    status: boolean;
    type: "Create",
    shareCertificateId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type CasesListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const CasesListPage:FC<{shareCertificateId: number, projectId: number}> = ({shareCertificateId, projectId}) => {
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [modal, setModal] = useState<CasesListModalProps>({status: false, type: 'Create', shareCertificateId: Number(shareCertificateId)});
    const toggleModal = (value:CasesListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<CasesListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:CasesListDrawerProps) => setDrawerStatus(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.cases}/delete-multiple`, 'Cases', [CasesQueryKey, shareCertificateId ? Number(shareCertificateId) : ''], selectedData);
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
                        Cases
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when
                hunger drives it to try biting a Steel-type Pokémon.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={true} buttonText={"Create"} buttonClickHandler={() => toggleModal({status: true, type: 'Create', shareCertificateId: Number(shareCertificateId)})} hasExport={false} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <CasesTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} shareCertificateId={Number(shareCertificateId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <CasesModal {...modal} shareCertificateId={Number(shareCertificateId)} projectId={Number(projectId)} toggleModal={toggleModal} />
            <CasesDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default CasesListPage;