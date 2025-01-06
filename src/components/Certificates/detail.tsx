import { FC } from "react"
import { Table } from '@mantine/core';
import { CertificatesListDrawerProps } from "../../pages/certificates/list";
import { useCertificateQuery } from "../../hooks/data/certificates";
import ErrorBoundary from "../Layout/ErrorBoundary";

const CertificateDetail:FC<CertificatesListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useCertificateQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Certificate Number</Table.Th>
                        <Table.Td>{data.certificateNumber}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Certificate Serial Number</Table.Th>
                        <Table.Td>{data.certificateSerialNumber}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Folio ID</Table.Th>
                        <Table.Td>{data.folioID}</Table.Td>
                    </Table.Tr>
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default CertificateDetail