import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { FC, useState } from "react";
import classes from './certificates.module.css';
import { useParams } from "react-router-dom";
import CertificatesTable from "../../../components/Certificates/table";
import CertificatesModal from "../../../components/Certificates/modal";
import CertificatesDrawer from "../../../components/Certificates/drawer";
import SearchButtonHeader from "../../../components/Layout/SearchButtonHeader";
import { useExcelExport } from "../../../hooks/useExcelExport";
import { api_routes } from "../../../utils/api_routes";
import { useDeleteMultiple } from "../../../hooks/useDeleteMultiple";
import { CertificatesQueryKey } from "../../../hooks/data/certificates";
import ExcelUploadModal from "../../../components/Layout/ExcelUploadModal";
import { ShareHolderDetailType } from "../../../utils/types";

export type CertificatesListModalProps = {
    status: boolean;
    type: "Create",
    folioId: number;
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

export type CertificatesListDrawerProps = {
    drawerStatus: false;
} | {
    drawerStatus: true;
    id: number;
}

const CertificatesListPage:FC<{
    shareHolder1?: ShareHolderDetailType | null | undefined;
    shareHolder2?: ShareHolderDetailType | null | undefined;
    shareHolder3?: ShareHolderDetailType | null | undefined;
}> = (props) => {
    const param = useParams<{folioId: string}>()
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.certificates + `/export/${param.folioId}`, 'certificates.xlsx');
    const [modal, setModal] = useState<CertificatesListModalProps>({status: false, type: 'Create', folioId: Number(param.folioId)});
    const toggleModal = (value:CertificatesListModalProps) => setModal(value);
    const [drawerStatus, setDrawerStatus] = useState<CertificatesListDrawerProps>({drawerStatus: false});
    const toggleDrawer = (value:CertificatesListDrawerProps) => setDrawerStatus(value);
    const [excelModal2, setExcelModal2] = useState<boolean>(false);
    const toggleExcelModal2 = () => setExcelModal2(prev => !prev);

    const deleteMultipleHandler = async () => {
        if(selectedData.length > 0) {
            await deleteMultiple(`${api_routes.certificates}/delete-multiple`, 'Certificates', [CertificatesQueryKey, param.folioId ? Number(param.folioId) : ''], selectedData);
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
                        Certificates
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />

            <Text c="dimmed" ta="center">
                This section contains the list of all the certificates which is related to the folio mentioned above. You can create a new certificates by clicking the "Create" button. You can also export the list of certificates to an excel file by clicking the "Export" button. You can also delete a certificates by clicking the "Delete" button. You can also view a certificate by clicking the "View" button.
            </Text>
            <Divider my="sm" mb="lg" variant="dashed" />
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', folioId: Number(param.folioId)})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal2} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <CertificatesTable toggleModal={toggleModal} toggleDrawer={toggleDrawer} folioId={Number(param.folioId)} selectedData={selectedData} setSelectedData={setSelectedData} />
            </Paper>
            <CertificatesModal {...modal} mainFolioId={Number(param.folioId)} toggleModal={toggleModal} shareHolder1={props.shareHolder1} shareHolder2={props.shareHolder2} shareHolder3={props.shareHolder3} />
            <CertificatesDrawer {...drawerStatus} toggleDrawer={toggleDrawer} />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Certificates" uploadUrl={`${api_routes.certificates}/import`} sampleUrl="/Sample_Certificates.xlsx" />
        </div>
    )
}

export default CertificatesListPage;