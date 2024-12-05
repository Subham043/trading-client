import { FC } from "react"
import { Table } from '@mantine/core';
import { StageTrackerDrawerProps } from "../../pages/stageTrackers/list";
import { useStageTrackerQuery } from "../../hooks/data/stage_trackers";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

const StageTrackerDetail:FC<StageTrackerDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useStageTrackerQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
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
                        <Table.Th>Pending From</Table.Th>
                        <Table.Td>{data.pendingFrom}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Comment</Table.Th>
                        <Table.Td>{data.comments}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Td>{data.date ? dayjs(data.date?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY') : ''}</Table.Td>
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

export default StageTrackerDetail