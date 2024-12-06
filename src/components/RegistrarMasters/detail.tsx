import { FC } from "react"
import { Box, Button, Group, Table, Text } from '@mantine/core';
import { useRegistrarMasterQuery } from "../../hooks/data/registrar_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { useParams } from "react-router-dom";
import { RegistrarMastersModalProps } from "../../pages/registrarMasters/list";
import RegistrarMasterBranchesListPage from "../../pages/registrarMasterBranches/list";
import dayjs from "dayjs";

const RegistrarMasterDetail:FC<{toggleModal: (value: RegistrarMastersModalProps) => void}> = (props) => {
    const param = useParams<{registrarMasterId: string}>();
  const {data, isFetching, isLoading, status, error, refetch} = useRegistrarMasterQuery(Number(param.registrarMasterId), true);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        <Group justify="space-between" mb="lg" align="center">
            <Text size="xl" fw={700}>Registrar Master Detail</Text>
            <Button type='submit' variant="filled" color='blue' onClick={() => props.toggleModal({status: true, type: 'Edit', id: Number(param.registrarMasterId)})}>
                Edit
            </Button>
        </Group>
        {(data) && <>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                    <Table.Thead bg="blue">
                        <Table.Tr>
                            <Table.Th style={{color: 'white'}}>ID</Table.Th>
                            <Table.Th style={{color: 'white'}}>Registrar Name</Table.Th>
                            <Table.Th style={{color: 'white'}}>SEBI Regn. ID</Table.Th>
                            <Table.Th style={{color: 'white'}}>Created On</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>{data.id}</Table.Td>
                            <Table.Td>{data.registrar_name}</Table.Td>
                            <Table.Td>{data.sebi_regn_id}</Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {(data && data.createdAt) && dayjs(data.createdAt.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </>}
        <Box bg="transparent" mt="md">
            <RegistrarMasterBranchesListPage />
        </Box>
    </ErrorBoundary>
  );
}

export default RegistrarMasterDetail