import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import CorporateMastersTable from "../../../components/CorporateMasters/table";
import CorporateMastersModal from "../../../components/CorporateMasters/modal";
import CorporateMastersDrawer from "../../../components/CorporateMasters/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { CorporateMastersQueryKey } from "../../../hooks/data/corporate_masters";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";

export type CorporateMastersListModalProps = {
    status: boolean;
    type: "Create",
    companyId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type CorporateMastersListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const CorporateMastersListPage:FC = () => {
    const param = useParams<{companyId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.corporateMasters + `/export/${param.companyId}`, 'corporate_masters.xlsx');
    const [modal, setModal] = useState<CorporateMastersListModalProps>({status: false, type: 'Create', companyId: Number(param.companyId)});
    const toggleModal = (value:CorporateMastersListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<CorporateMastersListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:CorporateMastersListDrawerProps) => setDrawerStatus(value);
    const [excelModal2, setExcelModal2] = useState<boolean>(false);
    const toggleExcelModal2 = () => setExcelModal2(prev => !prev);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.corporateMasters}/delete-multiple`, 'Corporate Masters', [CorporateMastersQueryKey, param.companyId ? Number(param.companyId) : ''], selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', companyId: Number(param.companyId)})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal2} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <CorporateMastersTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} companyId={Number(param.companyId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            <CorporateMastersModal {...modal} mainCompanyId={Number(param.companyId)} toggleModal={toggleModal} />
            <CorporateMastersDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Corporate Masters" uploadUrl={`${api_routes.corporateMasters}/import`} sampleUrl="/Sample_Corporate_Masters.xlsx" />
        </div>
    )
}

export default CorporateMastersListPage;