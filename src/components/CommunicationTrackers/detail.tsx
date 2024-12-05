import { FC } from "react"
import { Table } from '@mantine/core';
import { CommunicationTrackerDrawerProps } from "../../pages/communicationTrackers/list";
import { useCommunicationTrackerQuery } from "../../hooks/data/communication_trackers";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

const CommunicationTrackerDetail:FC<CommunicationTrackerDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useCommunicationTrackerQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Stage</Table.Th>
                        <Table.Td>{data.stage}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Company / Folio</Table.Th>
                        <Table.Td>{data.foliosSet.map((value) => value.Folio+' ('+(value.currentNameChangeMasters?.currentName || '')+')').join(', ')}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Comment</Table.Th>
                        <Table.Td>{data.comments}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Date Sent</Table.Th>
                        <Table.Td>{data.dateSent ? dayjs(data.dateSent?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY') : ''}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Date Received</Table.Th>
                        <Table.Td>{data.dateReceived ? dayjs(data.dateReceived?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY') : ''}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Created At</Table.Th>
                        <Table.Td>{dayjs(data.createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default CommunicationTrackerDetail