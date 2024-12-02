import { FC } from "react"
import { Table } from '@mantine/core';
import { ReferralTrackerStagesListDrawerProps } from "../../pages/referralTrackerStages/list";
import { useReferralTrackerStageQuery } from "../../hooks/data/referral_tracker_stages";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

const ReferralTrackerStageDetail:FC<ReferralTrackerStagesListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useReferralTrackerStageQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Status</Table.Th>
                        <Table.Td>{data.status}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Amount</Table.Th>
                        <Table.Td>{data.amount}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Td>{dayjs(data.date?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Created At</Table.Th>
                        <Table.Td>{dayjs(data.createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Payment Tracker ID</Table.Th>
                        <Table.Td>{data.paymentTrackerID}</Table.Td>
                    </Table.Tr>
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default ReferralTrackerStageDetail