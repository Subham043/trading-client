import { FC } from "react";
import { Modal } from '@mantine/core';
import ProjectsForm from "./form";
import { ProjectsListModalProps } from "../../pages/projects/list";

const ProjectsModal:FC<ProjectsListModalProps & {toggleModal: (value: ProjectsListModalProps) => void}> = (props) => {
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false, type: 'Create'})} centered size="sm" withCloseButton={true}  title={props.type === "Edit" ? "Edit Project" : "Create Project"} overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
            <ProjectsForm {...props} toggleModal={props.toggleModal} />
        </Modal>
    )
}

export default ProjectsModal;