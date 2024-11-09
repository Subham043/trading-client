import { FC } from "react"
import { Box, Button, Group, Table, Text } from '@mantine/core';
import { useShareCertificateMasterQuery } from "../../hooks/data/share_certificate_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { useParams } from "react-router-dom";
import { ShareCertificateMastersListModalProps } from "../../pages/shareCertificateMasters/list";
import FoliosListPage from "../../pages/folios/list";
import CasesListPage from "../../pages/cases/list";

const ShareCertificateMasterDetail:FC<{toggleModal: (value: ShareCertificateMastersListModalProps) => void}> = (props) => {
    const param = useParams<{shareCertificateMasterId: string}>();
  const {data, isFetching, isLoading, status, error, refetch} = useShareCertificateMasterQuery(Number(param.shareCertificateMasterId), true);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        <Group justify="space-between" mb="lg" align="center">
            <Text size="xl" fw={700}>Share Certificate Master Detail</Text>
            <Button type='submit' variant="filled" color='blue' onClick={() => props.toggleModal({status: true, type: 'Edit', id: Number(param.shareCertificateMasterId)})}>
                Edit
            </Button>
        </Group>
        {(data) && <>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                    <Table.Thead bg="blue">
                        <Table.Tr>
                            <Table.Th style={{color: 'white'}}>ID</Table.Th>
                            <Table.Th style={{color: 'white'}}>Name Of Company</Table.Th>
                            <Table.Th style={{color: 'white'}}>NSE</Table.Th>
                            <Table.Th style={{color: 'white'}}>BSE</Table.Th>
                            <Table.Th style={{color: 'white'}}>ISIN</Table.Th>
                            <Table.Th style={{color: 'white'}}>Intrument Type</Table.Th>
                            <Table.Th style={{color: 'white'}}>Face Value</Table.Th>
                            <Table.Th style={{color: 'white'}}>Closing Price NSE</Table.Th>
                            <Table.Th style={{color: 'white'}}>Closing Price BSE</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>{data.id}</Table.Td>
                            <Table.Td>{data.companyMaster?.currentNameChangeMasters?.currentName}</Table.Td>
                            <Table.Td>{data.companyMaster?.currentNameChangeMasters?.NSE}</Table.Td>
                            <Table.Td>{data.companyMaster?.currentNameChangeMasters?.BSE}</Table.Td>
                            <Table.Td>{data.companyMaster?.ISIN}</Table.Td>
                            <Table.Td>{data.instrumentType}</Table.Td>
                            <Table.Td>{data.companyMaster?.faceValue}</Table.Td>
                            <Table.Td>{data.companyMaster?.closingPriceNSE}</Table.Td>
                            <Table.Td>{data.companyMaster?.closingPriceBSE}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <Box bg="transparent" mt="md">
                <div style={{textAlign: 'center'}}>
                    <Text size="xl" fw={700} p="sm" >Folios</Text>
                </div>
                <FoliosListPage projectId={data.projectID || 0} />
            </Box>
            <Box bg="transparent" mt="lg">
                <div style={{textAlign: 'center'}}>
                    <Text size="xl" fw={700} p="sm" >Cases</Text>
                </div>
                <CasesListPage shareCertificateId={data.id || 0} projectId={data.projectID || 0} />
            </Box>
        </>}
    </ErrorBoundary>
  );
}

export default ShareCertificateMasterDetail