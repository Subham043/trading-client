import { FC } from "react"
import { Table } from '@mantine/core';
import { CorporateMastersListDrawerProps } from "../../pages/corporateMasters/list";
import { useCorporateMasterQuery } from "../../hooks/data/corporate_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

const CorporateMasterDetail:FC<CorporateMastersListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useCorporateMasterQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Td>{dayjs(data.date.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Type</Table.Th>
                        <Table.Td>{data.type}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Numerator</Table.Th>
                        <Table.Td>{data.numerator}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Denominator</Table.Th>
                        <Table.Td>{data.denominator}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Original Holding</Table.Th>
                        <Table.Td>{data.originalHolding}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>City</Table.Th>
                        <Table.Td>{data.exchange}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Consolidated Holding</Table.Th>
                        <Table.Td>{data.consolidatedHolding}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Company Master ID</Table.Th>
                        <Table.Td>{data.companyID}</Table.Td>
                    </Table.Tr>
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default CorporateMasterDetail