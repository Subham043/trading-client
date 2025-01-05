import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './suretys.module.css';
import SuretysTable from "../../../components/Suretys/table";
import SuretysModal from "../../../components/Suretys/modal";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { SuretysQueryKey } from "../../../hooks/data/suretys";
import { useParams } from "react-router-dom";

export type SuretysListModalProps = {
    status: boolean;
    type: "Create",
    projectId: string
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const SuretysListPage:FC = () => {
    const param = useParams<{projectId: string}>();
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const [modal, setModal] = useState<SuretysListModalProps>({status: false, type: 'Create', projectId: param.projectId ?? ''});
    const toggleModal = (value:SuretysListModalProps) => setModal(value);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.suretys}/delete-multiple`, 'Suretys', SuretysQueryKey, selectedData);
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
                            Surety
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                This section contains the list of all the surety which is related to the project mentioned above. You can create a new surety by clicking the "Create" button. You can also export the list of surety to an excel file by clicking the "Export" button. You can also import a list of surety from an excel file by clicking the "Import" button. You can also delete a surety by clicking the "Delete" button.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', projectId: param.projectId ?? ''})} hasExport={false} hasImport={false} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <SuretysTable toggleModal={toggleModal} selectedData={selectedData} setSelectedData={setSelectedData} projectId={param.projectId ?? ''} />
            </Paper>
            <SuretysModal {...modal} toggleModal={toggleModal} projectId={param.projectId ?? ''} />
        </div>
    )
}

export default SuretysListPage;