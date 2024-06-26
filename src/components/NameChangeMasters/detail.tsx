import { FC } from "react"
import { Table } from '@mantine/core';
import { NameChangeMastersListDrawerProps } from "../../pages/nameChangeMasters/list";
import { useNameChangeMasterQuery } from "../../hooks/data/name_change_masters";
import dayjs from "dayjs";
import ErrorBoundary from "../Layout/ErrorBoundary";

const NameChangeMasterDetail:FC<NameChangeMastersListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useNameChangeMasterQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>NSE</Table.Th>
                        <Table.Td>{data.NSE}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>BSE</Table.Th>
                        <Table.Td>{data.BSE}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>New Name</Table.Th>
                        <Table.Td>{data.currentName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Previous Name</Table.Th>
                        <Table.Td>{data.previousName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Date of Name Change</Table.Th>
                        <Table.Td>{data.dateNameChange && dayjs(data.dateNameChange.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                    {/* <Table.Tr>
                        <Table.Th>New RTA</Table.Th>
                        <Table.Td>{data.newRTA}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Previous RTA</Table.Th>
                        <Table.Td>{data.previousRTA}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Date of RTA Change</Table.Th>
                        <Table.Td>{data.dateRTAChange && dayjs(data.dateRTAChange.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>New Security Symbol</Table.Th>
                        <Table.Td>{data.newSecuritySymbol}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Old Security Symbol</Table.Th>
                        <Table.Td>{data.oldSecuritySymbol}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Date of Security Change</Table.Th>
                        <Table.Td>{data.dateSecurityChange && dayjs(data.dateSecurityChange.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr> */}
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default NameChangeMasterDetail