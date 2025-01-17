import { FC } from "react"
import { Table } from '@mantine/core';
import { FoliosListDrawerProps } from "../../pages/folios/list";
import { useFolioQuery } from "../../hooks/data/folios";
import ErrorBoundary from "../Layout/ErrorBoundary";

const FolioDetail:FC<FoliosListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useFolioQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Folio</Table.Th>
                        <Table.Td>{data.Folio}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Shareholder Name 1</Table.Th>
                        <Table.Td>{data.shareholderName1?.shareholderName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Shareholder Name 2</Table.Th>
                        <Table.Td>{data.shareholderName2?.shareholderName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Shareholder Name 3</Table.Th>
                        <Table.Td>{data.shareholderName3?.shareholderName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Share Certificate Master ID</Table.Th>
                        <Table.Td>{data.shareCertificateID}</Table.Td>
                    </Table.Tr>
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default FolioDetail