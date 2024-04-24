import { FC } from "react"
import { Table } from '@mantine/core';
import { RegistrarMastersListDrawerProps } from "../../pages/registrarMasters/list";
import { useRegistrarMasterQuery } from "../../hooks/data/registrar_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";

const RegistrarMasterDetail:FC<RegistrarMastersListDrawerProps> = (props) => {
  const {data, isFetching, isLoading, status, error, refetch} = useRegistrarMasterQuery(props.drawerStatus ? props.id : 0, props.drawerStatus);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        {(data) && <Table.ScrollContainer minWidth={'100%'}>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Company</Table.Th>
                        <Table.Td>{data.currentName}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Registrar Name</Table.Th>
                        <Table.Td>{data.registrar_name}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>SEBI Regn. ID</Table.Th>
                        <Table.Td>{data.sebi_regn_id}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Telephone 1</Table.Th>
                        <Table.Td>{data.telephone1}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Telephone 2</Table.Th>
                        <Table.Td>{data.telephone2}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Email</Table.Th>
                        <Table.Td>{data.email}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Website</Table.Th>
                        <Table.Td>{data.website}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>City</Table.Th>
                        <Table.Td>{data.city}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>State</Table.Th>
                        <Table.Td>{data.state}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Pincode</Table.Th>
                        <Table.Td>{data.pincode}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Name of Contact Person</Table.Th>
                        <Table.Td>{data.nameContactPerson}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Designation of Contact Person</Table.Th>
                        <Table.Td>{data.designationContactPerson}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Email of Contact Person</Table.Th>
                        <Table.Td>{data.emailContactPerson}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Phone of Contact Person</Table.Th>
                        <Table.Td>{data.phoneContactPerson}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Officer Assigned</Table.Th>
                        <Table.Td>{data.officerAssigned}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Branch</Table.Th>
                        <Table.Td>{data.branch}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Address</Table.Th>
                        <Table.Td>{data.address}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Company ID</Table.Th>
                        <Table.Td>{data.companyId}</Table.Td>
                    </Table.Tr>
                </Table.Thead>
            </Table>
        </Table.ScrollContainer>}
    </ErrorBoundary>
  );
}

export default RegistrarMasterDetail