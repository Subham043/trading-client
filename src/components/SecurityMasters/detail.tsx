import { FC } from "react"
import { Table } from '@mantine/core';
import { SecurityMastersListDrawerProps } from "../../pages/securityMasters/list";
import { useSecurityMasterQuery } from "../../hooks/data/security_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

const SecurityMasterDetail:FC<SecurityMastersListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useSecurityMasterQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name Of Company</Table.Th>
                        <Table.Td>{data.companyMaster?.currentNameChangeMasters?.currentName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>NSE</Table.Th>
                        <Table.Td>{data.companyMaster?.currentNameChangeMasters?.NSE}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>BSE</Table.Th>
                        <Table.Td>{data.companyMaster?.currentNameChangeMasters?.BSE}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>ISIN</Table.Th>
                        <Table.Td>{data.companyMaster?.ISIN}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Intrument Type</Table.Th>
                        <Table.Td>{data.instrumentType}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Equity Type</Table.Th>
                        <Table.Td>{data.equityType}</Table.Td>
                    </Table.Tr>
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
                        <Table.Th>Endorsement</Table.Th>
                        <Table.Td>{data.endorsement}</Table.Td>
                    </Table.Tr>
                    {data.endorsement === "Yes" && <>
                        <Table.Tr>
                            <Table.Th>Endorsement Folio</Table.Th>
                            <Table.Td>{data.endorsementFolio}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Endorsement Date</Table.Th>
                            <Table.Td>{dayjs(data.endorsementDate?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Endorsement Shareholder Name 1</Table.Th>
                            <Table.Td>{data.endorsementShareholderName1}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Endorsement Shareholder Name 2</Table.Th>
                            <Table.Td>{data.endorsementShareholderName2}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Endorsement Shareholder Name 3</Table.Th>
                            <Table.Td>{data.endorsementShareholderName3}</Table.Td>
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

export default SecurityMasterDetail