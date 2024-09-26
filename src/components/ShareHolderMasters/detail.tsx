import { FC } from "react"
import { Box, Button, Group, Table, Text } from '@mantine/core';
import { useShareHolderMasterInfoQuery } from "../../hooks/data/share_holder_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { useParams } from "react-router-dom";
import { ShareHolderMastersListModalProps } from "../../pages/shareHolderMasters/list";
import ShareHolderDetailsListPage from "../../pages/shareHolderDetails/list";

const ShareHolderMasterDetail:FC<{toggleModal: (value: ShareHolderMastersListModalProps) => void}> = (props) => {
    const param = useParams<{shareHolderMasterId: string}>();
  const {data, isFetching, isLoading, status, error, refetch} = useShareHolderMasterInfoQuery(Number(param.shareHolderMasterId), true);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        <Group justify="space-between" mb="lg" align="center">
            <Text size="xl" fw={700}>Share Holder Master Detail</Text>
            <Button type='submit' variant="filled" color='blue' onClick={() => props.toggleModal({status: true, type: 'Edit', id: Number(param.shareHolderMasterId)})}>
                Edit
            </Button>
        </Group>
        {(data) && <>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                    <Table.Thead bg="blue">
                        <Table.Tr>
                            <Table.Th style={{color: 'white'}}>ID</Table.Th>
                            <Table.Th style={{color: 'white'}}>Case Type</Table.Th>
                            <Table.Th style={{color: 'white'}}>No. Of Legal Heirs</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>{data.id}</Table.Td>
                            <Table.Td>{data.caseType}</Table.Td>
                            <Table.Td>{data.noOfLegalHeir}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <Box bg="transparent" mt="md">
                <div style={{textAlign: 'center'}}>
                    <Text size="xl" fw={700} p="sm" >Share Holder Details</Text>
                </div>
                <ShareHolderDetailsListPage shareHolderMasterData={data} />
            </Box>
        </>}
    </ErrorBoundary>
  );
}

export default ShareHolderMasterDetail