import { FC } from "react"
import { Table } from '@mantine/core';
import { DividendMastersListDrawerProps } from "../../pages/dividendMasters/list";
import { useDividendMasterQuery } from "../../hooks/data/dividend_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";

const DividendMasterDetail:FC<DividendMastersListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useDividendMasterQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Recorded Date</Table.Th>
                        <Table.Td>{data.recorded_date}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Financial Year</Table.Th>
                        <Table.Td>{data.financial_year}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Dividend Per Share</Table.Th>
                        <Table.Td>{data.dividend_per_share}</Table.Td>
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

export default DividendMasterDetail