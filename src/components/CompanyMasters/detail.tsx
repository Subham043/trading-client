import { FC } from "react"
import { Table, Group, Text, Box, Button, Paper, SimpleGrid } from '@mantine/core';
import { useParams } from "react-router-dom";
import { CompanyMastersDetailModalProps } from "../../pages/companyMasters/detail";
import classes from '../../pages/companyMasters/detail/companyMasters.module.css'
import { useCompanyMaster } from "../../hooks/data/company_masters";
import NameChangeMastersListPage from "../../pages/nameChangeMasters/list";
import ErrorBoundary from "../Layout/ErrorBoundary";

const CompanyMasterDetail:FC<{toggleModal: (value: CompanyMastersDetailModalProps) => void}> = (props) => {
  const param = useParams<{companyId: string}>();
  const {data, isFetching, isLoading, status, error, refetch} = useCompanyMaster(Number(param.companyId), true);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        <Group justify="space-between" mb="lg" align="center">
            <Text size="xl" fw={700}>Company Master Detail</Text>
            <Button type='submit' variant="filled" color='blue' onClick={() => props.toggleModal({status: true, type: 'Edit', id: Number(param.companyId)})}>
                Edit
            </Button>
        </Group>
        <Box pos="relative" mb="sm">
            <Paper shadow="sm" className={classes.paper_background}>
                {(data) && <>
                    <Table.ScrollContainer minWidth={800}>
                        <Table verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>ISIN</Table.Th>
                                    <Table.Th>CIN</Table.Th>
                                    <Table.Th>BSE</Table.Th>
                                    <Table.Th>NSE</Table.Th>
                                    <Table.Th>Face Value</Table.Th>
                                    <Table.Th>Closing Price in NSE</Table.Th>
                                    <Table.Th>Closing Price in BSE</Table.Th>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>{data.newName}</Table.Td>
                                    <Table.Td>{data.ISIN}</Table.Td>
                                    <Table.Td>{data.CIN}</Table.Td>
                                    <Table.Td>{data.BSE}</Table.Td>
                                    <Table.Td>{data.NSE}</Table.Td>
                                    <Table.Td>{data.faceValue}</Table.Td>
                                    <Table.Td>{data.closingPriceNSE}</Table.Td>
                                    <Table.Td>{data.closingPriceBSE}</Table.Td>
                                </Table.Tr>
                            </Table.Thead>
                        </Table>
                    </Table.ScrollContainer>
                </>}
            </Paper>
        </Box>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Box pos="relative">
                <Paper shadow="sm" className={classes.paper_background}>
                    <Text size="lg" fw={700} p="sm">Address</Text>
                    {(data) && <>
                        <Table.ScrollContainer minWidth={'100%'}>
                            <Table verticalSpacing="sm">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Registered Office</Table.Th>
                                        <Table.Td>{data.registeredOffice}</Table.Td>
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
                                        <Table.Th>Telephone</Table.Th>
                                        <Table.Td>{data.telephone}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Fax</Table.Th>
                                        <Table.Td>{data.fax}</Table.Td>
                                    </Table.Tr>
                                </Table.Thead>
                            </Table>
                        </Table.ScrollContainer>
                    </>}
                </Paper>
            </Box>
            <Box pos="relative">
                <Paper shadow="sm" className={classes.paper_background}>
                    <Text size="lg" fw={700} p="sm">Contact</Text>
                    {(data) && <>
                        <Table.ScrollContainer minWidth={'100%'}>
                            <Table verticalSpacing="sm">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Email</Table.Th>
                                        <Table.Td>{data.email}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Website</Table.Th>
                                        <Table.Td>{data.website}</Table.Td>
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
                                </Table.Thead>
                            </Table>
                        </Table.ScrollContainer>
                    </>}
                </Paper>
            </Box>
        </SimpleGrid>
        <Box bg="transparent" mt="md">
            <div style={{textAlign: 'center'}}>
                <Text size="xl" fw={700} p="sm" >Name Change Masters</Text>
            </div>
            <NameChangeMastersListPage />
        </Box>
    </ErrorBoundary>
  );
}

export default CompanyMasterDetail