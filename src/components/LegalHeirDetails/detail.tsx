import { FC } from "react"
import { Table } from '@mantine/core';
import { LegalHeirDetailsListDrawerProps } from "../../pages/legalHeirDetails/list";
import { useLegalHeirDetailQuery } from "../../hooks/data/legal_heir_details";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

const LegalHeirDetailDetail:FC<LegalHeirDetailsListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useLegalHeirDetailQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name as Per Pan</Table.Th>
                        <Table.Td>{data.namePan}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Name as Per Aadhar</Table.Th>
                        <Table.Td>{data.nameAadhar}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Name as Per CML</Table.Th>
                        <Table.Td>{data.nameCml}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Father/Husband Name</Table.Th>
                        <Table.Td>{data.husbandName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Contact Phone Number</Table.Th>
                        <Table.Td>{data.phone}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Contact Email address</Table.Th>
                        <Table.Td>{data.email}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Aadhaar Number (if applicable)</Table.Th>
                        <Table.Td>{data.aadhar}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client PAN (Permanent Account Number)</Table.Th>
                        <Table.Td>{data.pan}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Age</Table.Th>
                        <Table.Td>{data.age}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Occupation</Table.Th>
                        <Table.Td>{data.occupation}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Date of Birth (if applicable)</Table.Th>
                        <Table.Td>{dayjs(data.dob?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client nationality</Table.Th>
                        <Table.Td>{data.nationality}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Place of Birth</Table.Th>
                        <Table.Td>{data.placeOfBirth}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client City</Table.Th>
                        <Table.Td>{data.city}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client State</Table.Th>
                        <Table.Td>{data.state}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client country of birth</Table.Th>
                        <Table.Td>{data.countryOfBirth}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client DP ID</Table.Th>
                        <Table.Td>{data.DPID}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client name as per Bank account</Table.Th>
                        <Table.Td>{data.nameBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank name</Table.Th>
                        <Table.Td>{data.bankName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Branch name</Table.Th>
                        <Table.Td>{data.branchName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank address</Table.Th>
                        <Table.Td>{data.addressBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank Email</Table.Th>
                        <Table.Td>{data.bankEmail}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank Phone number</Table.Th>
                        <Table.Td>{data.bankPhone}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank account MICR code</Table.Th>
                        <Table.Td>{data.bankMICR}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank account IFS code</Table.Th>
                        <Table.Td>{data.bankIFS}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank Account Number</Table.Th>
                        <Table.Td>{data.bankAccountNo}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Bank account type</Table.Th>
                        <Table.Td>{data.bankAccountType}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Account Opening Date</Table.Th>
                        <Table.Td>{dayjs(data.accountOpeningDate?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client address as per Bank</Table.Th>
                        <Table.Td>{data.addressBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Email ID as per Bank</Table.Th>
                        <Table.Td>{data.emailBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client Phone number as per Bank</Table.Th>
                        <Table.Td>{data.phoneBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Client address PIN code</Table.Th>
                        <Table.Td>{data.pincodeBank}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Demat Account No.</Table.Th>
                        <Table.Td>{data.dematAccountNo}</Table.Td>
                    </Table.Tr>
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default LegalHeirDetailDetail