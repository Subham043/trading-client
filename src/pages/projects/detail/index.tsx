import { FC, useState } from "react";
import ProjectDetail from "../../../components/Projects/detail";
import ProjectModal from "../../../components/Projects/modal";
import { ProjectsListModalProps } from "../list";

const ProjectsDetailPage:FC = () => {
    const [modal, setModal] = useState<ProjectsListModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:ProjectsListModalProps) => setModal(value);

    return (
        <div>
            <ProjectDetail toggleModal={toggleModal} />
            <ProjectModal {...modal} toggleModal={toggleModal} />
        </div>
    )
}

export default ProjectsDetailPage;