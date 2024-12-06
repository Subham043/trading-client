import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
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
import { useParams } from "react-router-dom";

export type ShareCertificateMastersListModalProps = {
    status: boolean;
    type: "Create",
    projectId: string
} | {
    status: boolean;
    type: "Edit";
    id: number;
}

const ShareCertificateMastersListPage:FC = () => {
    const param = useParams<{projectId: string}>();
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const { exportExcel, excelLoading } = useExcelExport();
    const { deleteMultiple, deleteLoading } = useDeleteMultiple();
    const exportExcelHandler = async () => await exportExcel(api_routes.shareCertificateMasters + `/export/${param.projectId}`, 'share_certificate_masters.xlsx');
    const [modal, setModal] = useState<ShareCertificateMastersListModalProps>({status: false, type: 'Create', projectId: param.projectId ?? ''});
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
            <Divider 
                mb="xs" 
                variant="dashed"
                label={
                    <Group justify="center">
                        <Badge variant="filled" size="lg">
                        Share Certificate Masters
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
            <SearchButtonHeader hasButton={true} buttonText="Create" buttonClickHandler={() => toggleModal({status: true, type: 'Create', projectId: param.projectId ?? ''})} hasExport={true} excelLoading={excelLoading} exportClickHandler={exportExcelHandler} hasImport={true} importClickHandler={toggleExcelModal2} hasDelete={selectedData.length>0} deleteClickHandler={deleteMultipleHandler} deleteLoading={deleteLoading} hasMultipleImport={false} />
            <Paper shadow="sm" className={classes.paper_background}>
                <ShareCertificateMastersTable toggleModal={toggleModal} selectedData={selectedData} setSelectedData={setSelectedData} projectId={param.projectId ?? ''} />
            </Paper>
            <ShareCertificateMastersModal {...modal} toggleModal={toggleModal} projectId={param.projectId ?? ''} />
            <ExcelUploadModal status={excelModal2} toggleModal={toggleExcelModal2} title="Share Certificate Masters" uploadUrl={`${api_routes.shareCertificateMasters}/import/${param.projectId}`} sampleUrl="/Sample_Share_Certificate_Masters.xlsx" />
        </div>
    )
}

export default ShareCertificateMastersListPage;