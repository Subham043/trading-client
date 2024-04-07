import { Button, Group, Paper, TextInput, rem } from "@mantine/core";
import { FC, useState } from "react";
import classes from './nameChangeMasters.module.css';
import { IconSearch } from "@tabler/icons-react";
import { useParams, useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";
import { QueryInitialPageParam, QueryTotalCount } from "../../../utils/constant";
import NameChangeMasterTable from "../../../components/NameChangeMasters/table";
import NameChangeMasterModal from "../../../components/NameChangeMasters/modal";
import NameChangeMasterDrawer from "../../../components/NameChangeMasters/drawer";

export type ModalProps = {
    status: boolean;
    type: "Create",
    companyId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type DrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const NameChangeMastersListPage:FC = () => {
    const param = useParams<{companyId: string}>()
    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
    const [modal, setModal] = useState<ModalProps>({status: false, type: 'Create', companyId: Number(param.companyId)});
    const toggleModal = (value:ModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<DrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:DrawerProps) => setDrawerStatus(value);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchHandler = debounce((value: string) => setSearchParams({page: searchParams.get('page') || QueryInitialPageParam.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: value}), 500)

    return (
        <div>
            <Group justify="space-between" mb="lg">
                <Button type='submit' variant="filled" color='blue' onClick={() => toggleModal({status: true, type: 'Create', companyId: Number(param.companyId)})}>
                    Change
                </Button>
                <TextInput
                    rightSectionPointerEvents="none"
                    rightSection={icon}
                    placeholder="Search"
                    onChange={(event) => searchHandler(event.target.value)}
                />
            </Group>
            <Paper shadow="sm" className={classes.paper_background}>
                <NameChangeMasterTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} companyId={Number(param.companyId)} />
            </Paper>
            <NameChangeMasterModal {...modal} mainCompanyId={Number(param.companyId)} toggleModal={toggleModal} />
            <NameChangeMasterDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
        </div>
    )
}

export default NameChangeMastersListPage;