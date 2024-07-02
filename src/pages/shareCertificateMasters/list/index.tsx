import { Paper } from "@mantine/core";
import { FC, useState } from "react";
import classes from './shareCertificateMasters.module.css';
import ShareCertificateMastersTable from "../../../components/ShareCertificateMasters/table";
import ShareCertificateMastersModal from "../../../components/ShareCertificateMasters/modal";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { ShareCertificateMastersQueryKey } from "../../../hooks/data/share_certificate_masters";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";

export type ShareCertificateMastersListModalProps = {
    status: boolean;
    type: "Create",
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const ShareCertificateMastersListPage:FC = () => {
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.shareCertificateMasters + `/export`, 'share_certificate_masters.xlsx');
    const [modal, setModal] = useState<ShareCertificateMastersListModalProps>({status: false, type: 'Create'});
    const toggleModal = (value:ShareCertificateMastersListModalProps) => setModal(value);
    const [excelModal2, setExcelModal2] = useState<boolean>(false);
    const toggleExcelModal2 = () => setExcelModal2(prev => !prev);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.shareCertificateMasters}/delete-multiple`, 'Share Certificate Masters', ShareCertificateMastersQueryKey, selectedData);
            setSelectedData([]);
        }
    }

    return (
        <div>
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create'})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal2} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <ShareCertificateMastersTable toggleModal={toggleModal} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <ShareCertificateMastersModal {...modal} toggleModal={toggleModal} />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Share Certificate Masters" uploadUrl={`${api_routes.shareCertificateMasters}/import`} sampleUrl="/Sample_Security_Masters.xlsx" />
        </div>
    )
}

export default ShareCertificateMastersListPage;