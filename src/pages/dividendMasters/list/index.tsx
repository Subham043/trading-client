import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import DividendMastersTable from "../../../components/DividendMasters/table";
import DividendMastersModal from "../../../components/DividendMasters/modal";
import DividendMastersDrawer from "../../../components/DividendMasters/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { DividendMastersQueryKey } from "../../../hooks/data/dividend_masters";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";
import { Badge, Divider, Group, Text } from "@mantine/core";

export type DividendMastersListModalProps = {
    status: boolean;
    type: "Create",
    companyId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type DividendMastersListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const DividendMastersListPage:FC = () => {
    const param = useParams<{companyId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.dividendMasters + `/export/${param.companyId}`, 'dividend_masters.xlsx');
    const [modal, setModal] = useState<DividendMastersListModalProps>({status: false, type: 'Create', companyId: Number(param.companyId)});
    const toggleModal = (value:DividendMastersListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<DividendMastersListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:DividendMastersListDrawerProps) => setDrawerStatus(value);
    const [excelModal2, setExcelModal2] = useState<boolean>(false);
    const toggleExcelModal2 = () => setExcelModal2(prev => !prev);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.dividendMasters}/delete-multiple`, 'Dividend Masters', [DividendMastersQueryKey, param.companyId ? Number(param.companyId) : ''], selectedData);
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
                        Dividend Masters
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
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', companyId: Number(param.companyId)})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal2} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <DividendMastersTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} companyId={Number(param.companyId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            <DividendMastersModal {...modal} mainCompanyId={Number(param.companyId)} toggleModal={toggleModal} />
            <DividendMastersDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Dividend Masters" uploadUrl={`${api_routes.dividendMasters}/import`} sampleUrl="/Sample_Dividend_Masters.xlsx" />
        </div>
    )
}

export default DividendMastersListPage;