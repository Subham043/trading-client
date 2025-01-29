import { FC } from "react"
import { Box, Button, Group, Table, Text } from '@mantine/core';
import { useFolioQuery } from "../../hooks/data/folios";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { useParams } from "react-router-dom";
import { FoliosListModalProps } from "../../pages/folios/list";
import CertificatesListPage from "../../pages/certificates/list";
import FolioCorporateMasterPage from "./corporate_master_page";
import FolioDividendMasterPage from "./dividend_master_page";

const FolioDetailPage:FC<{toggleModal: (value: FoliosListModalProps) => void}> = (props) => {
  const param = useParams<{folioId: string}>();
  const {data, isFetching, isLoading, status, error, refetch} = useFolioQuery(Number(param.folioId), true);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        <Group justify="space-between" mb="lg" align="center">
            <Text size="xl" fw={700}>Folio Detail</Text>
            <Button type='submit' variant="filled" color='blue' onClick={() => props.toggleModal({status: true, type: 'Edit', id: Number(param.folioId)})}>
                Edit
            </Button>
        </Group>
        {(data) && <>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                    <Table.Thead bg="blue">
                        <Table.Tr>
                            <Table.Th style={{color: 'white'}}>ID</Table.Th>
                            <Table.Th style={{color: 'white'}}>Name Of Shareholders</Table.Th>
                            <Table.Th style={{color: 'white'}}>Folio</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>{data.id}</Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {[data.shareholderName1?.shareholderName, data.shareholderName2?.shareholderName, data.shareholderName3?.shareholderName].filter((value) => value).join(', ')}
                                </Text>
                            </Table.Td>
                            <Table.Td>{data.Folio}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <Box bg="transparent" mt="md">
                <CertificatesListPage shareHolder1={data.shareholderName1} shareHolder2={data.shareholderName2} shareHolder3={data.shareholderName3} />
            </Box>
            <Box bg="transparent" mt="xl">
                <FolioCorporateMasterPage id={data.id} />
            </Box>
            <Box bg="transparent" mt="xl">
                <FolioDividendMasterPage id={data.id} />
            </Box>
        </>}
    </ErrorBoundary>
  );
}

export default FolioDetailPage