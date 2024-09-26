import { FC } from "react"
import { Table } from '@mantine/core';
import { ShareHolderDetailsListDrawerProps } from "../../pages/shareHolderDetails/list";
import { useShareHolderDetailQuery } from "../../hooks/data/share_holder_details";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

const ShareHolderDetailDetail:FC<ShareHolderDetailsListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useShareHolderDetailQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ShareHolderDetail</Table.Th>
                        <Table.Td>{data.shareholderName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Date of Allotment</Table.Th>
                        <Table.Td>{dayjs(data.createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default ShareHolderDetailDetail