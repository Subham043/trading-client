import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './projects.module.css';
import ProjectsTable from "../../../components/Projects/table";
import ProjectsModal from "../../../components/Projects/modal";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { ProjectsQueryKey } from "../../../hooks/data/projects";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";

export type ProjectsListModalProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const ProjectsListPage:FC = () => {
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.projects + `/export`, 'project.xlsx');
    const [modal, setModal] = useState<ProjectsListModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:ProjectsListModalProps) => setModal(value);
    const [excelModal2, setExcelModal2] = useState<boolean>(false);
    const toggleExcelModal2 = () => setExcelModal2(prev => !prev);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.projects}/delete-multiple`, 'Projects', ProjectsQueryKey, selectedData);
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
                        Projects
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
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create'})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal2} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <ProjectsTable toggleModal={toggleModal} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <ProjectsModal {...modal} toggleModal={toggleModal} />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Projects" uploadUrl={`${api_routes.projects}/import`} sampleUrl="/Sample_Projects.xlsx" />
        </div>
    )
}

export default ProjectsListPage;