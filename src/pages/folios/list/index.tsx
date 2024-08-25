import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './folios.module.css';
import { useParams } from "react-router-dom";
import FoliosTable from "../../../components/Folios/table";
import FoliosModal from "../../../components/Folios/modal";
import FoliosDrawer from "../../../components/Folios/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { FoliosQueryKey } from "../../../hooks/data/folios";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";
import FolioCorporateMasterModal from "../../../components/Folios/corporate_master_modal";
import FolioDividendMasterModal from "../../../components/Folios/dividend_master_modal";

export type FoliosListModalProps = {
    status: boolean;
    type: "Create",
    shareCertificateMasterId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type FoliosCorporateMasterModalProps = {
    status: false;
} | {
    status: true;
    id: number;
}

export type FoliosDividendMasterModalProps = {
    status: false;
} | {
    status: true;
    id: number;
}

export type FoliosListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const FoliosListPage:FC = () => {
    const param = useParams<{shareCertificateMasterId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.folios + `/export/${param.shareCertificateMasterId}`, 'folios.xlsx');
    const [modal, setModal] = useState<FoliosListModalProps>({status: false, type: 'Create', shareCertificateMasterId: Number(param.shareCertificateMasterId)});
    const toggleModal = (value:FoliosListModalProps) => setModal(value);
    const [corporateModal, setCorporateModal] = useState<FoliosCorporateMasterModalProps>({status: false});
    const toggleCorporateModal = (value:FoliosCorporateMasterModalProps) => setCorporateModal(value);
    const [dividendModal, setDividendModal] = useState<FoliosDividendMasterModalProps>({status: false});
    const toggleDividendModal = (value:FoliosDividendMasterModalProps) => setDividendModal(value);
    const [drawerStatus, setDrawerStatus] = useState<FoliosListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:FoliosListDrawerProps) => setDrawerStatus(value);
    const [excelModal2, setExcelModal2] = useState<boolean>(false);
    const toggleExcelModal2 = () => setExcelModal2(prev => !prev);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.folios}/delete-multiple`, 'Folios', [FoliosQueryKey, param.shareCertificateMasterId ? Number(param.shareCertificateMasterId) : ''], selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', shareCertificateMasterId: Number(param.shareCertificateMasterId)})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal2} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <FoliosTable toggleModal={toggleModal} toggleCorporateModal={toggleCorporateModal} toggleDividendModal={toggleDividendModal} toggleDrawer={toggleDrawer} shareCertificateMasterId={Number(param.shareCertificateMasterId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <FoliosModal {...modal} mainShareCertificateMasterId={Number(param.shareCertificateMasterId)} toggleModal={toggleModal} />
            <FolioCorporateMasterModal {...corporateModal} toggleModal={toggleCorporateModal} />
            <FolioDividendMasterModal {...dividendModal} toggleModal={toggleDividendModal} />
            <FoliosDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Folios" uploadUrl={`${api_routes.folios}/import`} sampleUrl="/Sample_Folios.xlsx" />
        </div>
    )
}

export default FoliosListPage;