import { FC } from "react"
import { Table } from '@mantine/core';
import { SecurityTypeMastersListDrawerProps } from "../../pages/securityTypeMasters/list";
import { useSecurityTypeMasterQuery } from "../../hooks/data/security_type_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

const SecurityTypeMasterDetail:FC<SecurityTypeMastersListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useSecurityTypeMasterQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Td>{data.id}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Intrument Type</Table.Th>
                        <Table.Td>{data.instrumentType}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Name Of Company</Table.Th>
                        <Table.Td>{data.companyMaster?.currentNameChangeMasters?.currentName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Symbol</Table.Th>
                        <Table.Td>{data.Symbol}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Series</Table.Th>
                        <Table.Td>{data.Series}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Market Lot</Table.Th>
                        <Table.Td>{data.marketLot}</Table.Td>
                    </Table.Tr>
                    {data.instrumentType !== "Warrant" && <>
                        <Table.Tr>
                            <Table.Th>Paid Up Value</Table.Th>
                            <Table.Td>{data.paidUpValue}</Table.Td>
                        </Table.Tr>
                        {data.instrumentType !== "PreferenceShares" && <Table.Tr>
                            <Table.Th>ISIN Number</Table.Th>
                            <Table.Td>{data.isinNumber}</Table.Td>
                        </Table.Tr>}
                        <Table.Tr>
                            <Table.Th>Face Value</Table.Th>
                            <Table.Td>{data.companyMaster?.faceValue}</Table.Td>
                        </Table.Tr>
                    </>}
                    <Table.Tr>
                        <Table.Th>Date Of Listing</Table.Th>
                        <Table.Td>{data.dateOfListing ? dayjs(data.dateOfListing?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY') : ''}</Table.Td>
                    </Table.Tr>
                    {data.instrumentType === "PreferenceShares" && <>
                        <Table.Tr>
                            <Table.Th>Date of Allotment</Table.Th>
                            <Table.Td>{data.dateOfAllotment ? dayjs(data.dateOfAllotment?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY') : ''}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Security Name</Table.Th>
                            <Table.Td>{data.securityName}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Dividend</Table.Th>
                            <Table.Td>{data.dividend}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Redemption Amount</Table.Th>
                            <Table.Td>{data.redemptionAmount}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Redemption Date</Table.Th>
                            <Table.Td>{dayjs(data.redemptionDate?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Conversion Amount</Table.Th>
                            <Table.Td>{data.conversionAmount}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Conversion Date</Table.Th>
                            <Table.Td>{dayjs(data.conversionDate?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                        </Table.Tr>
                    </>}
                    {data.instrumentType === "Warrant" && <>
                        <Table.Tr>
                            <Table.Th>Distinctive Nos From</Table.Th>
                            <Table.Td>{data.distinctiveNosFrom}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Distinctive Nos To</Table.Th>
                            <Table.Td>{data.distinctiveNosTo}</Table.Td>
                        </Table.Tr>
                    </>}
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

export default SecurityTypeMasterDetail