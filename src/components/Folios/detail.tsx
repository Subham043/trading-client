import { FC } from "react"
import { Table } from '@mantine/core';
import { FoliosListDrawerProps } from "../../pages/folios/list";
import { useFolioQuery } from "../../hooks/data/folios";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

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
                        <Table.Th>Certificate Number</Table.Th>
                        <Table.Td>{data.certificateNumber}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Certificate Serial Number</Table.Th>
                        <Table.Td>{data.certificateSerialNumber}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Shareholder Name 1</Table.Th>
                        <Table.Td>{data.shareholderName1}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Shareholder Name 2</Table.Th>
                        <Table.Td>{data.shareholderName2}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Shareholder Name 3</Table.Th>
                        <Table.Td>{data.shareholderName3}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Face Value</Table.Th>
                        <Table.Td>{data.faceValue}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>No. of Shares</Table.Th>
                        <Table.Td>{data.noOfShares}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>No. of Shares in words</Table.Th>
                        <Table.Td>{data.noOfSharesWords}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Date of Allotment</Table.Th>
                        <Table.Td>{dayjs(data.dateOfAllotment?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Distinctive Nos From</Table.Th>
                        <Table.Td>{data.distinctiveNosFrom}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Distinctive Nos To</Table.Th>
                        <Table.Td>{data.distinctiveNosTo}</Table.Td>
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