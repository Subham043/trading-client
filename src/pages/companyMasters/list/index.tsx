import { Button, Group, Paper, TextInput, rem } from "@mantine/core";
import { FC, useState } from "react";
import classes from './companyMasters.module.css';
import { IconSearch } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";
import { QueryInitialPageParam, QueryTotalCount } from "../../../utils/constant";
import CompanyMasterTable from "../../../components/CompanyMasters/table";
import CompanyMasterModal from "../../../components/CompanyMasters/modal";

export type ModalProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const CompanyMastersPage:FC = () => {
    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
    const [modal, setModal] = useState<ModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:ModalProps) => setModal(value);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchHandler = debounce((value: string) => setSearchParams({page: searchParams.get('page') || QueryInitialPageParam.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: value}), 500)

    return (
        <div>
            <Group justify="space-between" mb="lg">
                <Button type='submit' variant="filled" color='blue' onClick={() => toggleModal({status: true, type: 'Create'})}>
                    Create
                </Button>
                <TextInput
                    rightSectionPointerEvents="none"
                    rightSection={icon}
                    placeholder="Search"
                    onChange={(event) => searchHandler(event.target.value)}
                />
            </Group>
            <Paper shadow="sm" className={classes.paper_background}>
                <CompanyMasterTable toggleModal={toggleModal} />
            </Paper>
            <CompanyMasterModal {...modal} toggleModal={toggleModal} />
        </div>
    )
}

export default CompanyMastersPage;