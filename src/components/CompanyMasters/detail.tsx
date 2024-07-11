import { FC } from "react"
import { Table, Group, Text, Box, Button, SimpleGrid } from '@mantine/core';
import { useParams } from "react-router-dom";
import { CompanyMastersDetailModalProps } from "../../pages/companyMasters/detail";
import { useCompanyMasterQuery } from "../../hooks/data/company_masters";
import NameChangeMastersListPage from "../../pages/nameChangeMasters/list";
import ErrorBoundary from "../Layout/ErrorBoundary";
import CorporateMastersListPage from "../../pages/corporateMasters/list";

const CompanyMasterDetail:FC<{toggleModal: (value: CompanyMastersDetailModalProps) => void}> = (props) => {
  const param = useParams<{companyId: string}>();
  const {data, isFetching, isLoading, status, error, refetch} = useCompanyMasterQuery(Number(param.companyId), true);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        <Group justify="space-between" mb="lg" align="center">
            <Text size="xl" fw={700}>Company Master Detail</Text>
            <Button type='submit' variant="filled" color='blue' onClick={() => props.toggleModal({status: true, type: 'Edit', id: Number(param.companyId)})}>
                Edit
            </Button>
        </Group>
        {(data) && <>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                    <Table.Thead bg="blue">
                        <Table.Tr>
                            <Table.Th style={{color: 'white'}}>Current Name</Table.Th>
                            <Table.Th style={{color: 'white'}}>ISIN</Table.Th>
                            <Table.Th style={{color: 'white'}}>CIN</Table.Th>
                            <Table.Th style={{color: 'white'}}>BSE</Table.Th>
                            <Table.Th style={{color: 'white'}}>NSE</Table.Th>
                            <Table.Th style={{color: 'white'}}>Face Value</Table.Th>
                            <Table.Th style={{color: 'white'}}>Closing Price in NSE</Table.Th>
                            <Table.Th style={{color: 'white'}}>Closing Price in BSE</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>{data.currentNameChangeMasters?.currentName}</Table.Td>
                            <Table.Td>{data.ISIN}</Table.Td>
                            <Table.Td>{data.CIN}</Table.Td>
                            <Table.Td>{data.currentNameChangeMasters?.BSE}</Table.Td>
                            <Table.Td>{data.currentNameChangeMasters?.NSE}</Table.Td>
                            <Table.Td>{data.faceValue}</Table.Td>
                            <Table.Td>{data.closingPriceNSE}</Table.Td>
                            <Table.Td>{data.closingPriceBSE}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </>}
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <div>
                <div style={{textAlign: 'center'}}>
                    <Text size="lg" fw={700} p="sm" bg="blue" color="white">Company Address</Text>
                </div>
                {(data) && <>
                    <Table.ScrollContainer minWidth={'100%'}>
                        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
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
            </div>
            <div>
                <div style={{textAlign: 'center'}}>
                    <Text size="lg" fw={700} p="sm" bg="blue" color="white">Company Contact</Text>
                </div>
                {(data) && <>
                    <Table.ScrollContainer minWidth={'100%'}>
                        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
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
            </div>
        </SimpleGrid>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <div>
                <div style={{textAlign: 'center'}}>
                    <Text size="lg" fw={700} p="sm" bg="blue" color="white">Registrar Master Address</Text>
                </div>
                {(data) && <>
                    <Table.ScrollContainer minWidth={'100%'}>
                        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Registrar Branch</Table.Th>
                                    <Table.Td>{data.registrarMasterBranch?.branch}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Registrar City</Table.Th>
                                    <Table.Td>{data.registrarMasterBranch?.city}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Registrar State</Table.Th>
                                    <Table.Td>{data.registrarMasterBranch?.state}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Registrar Pincode</Table.Th>
                                    <Table.Td>{data.registrarMasterBranch?.pincode}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Registrar Address</Table.Th>
                                    <Table.Td>{data.registrarMasterBranch?.address}</Table.Td>
                                </Table.Tr>
                            </Table.Thead>
                        </Table>
                    </Table.ScrollContainer>
                </>}
            </div>
            <div>
                <div style={{textAlign: 'center'}}>
                    <Text size="lg" fw={700} p="sm" bg="blue" color="white">Registrar Master Contact</Text>
                </div>
                {(data) && <>
                    <Table.ScrollContainer minWidth={'100%'}>
                        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Registrar Name</Table.Th>
                                    <Table.Td>{data.registrarMasterBranch?.registrarMaster?.registrar_name}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>SEBI Regn. ID</Table.Th>
                                    <Table.Td>{data.registrarMasterBranch?.registrarMaster?.sebi_regn_id}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Contact Person Name</Table.Th>
                                    <Table.Td>{data.registrarMasterBranch?.nameContactPerson}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Contact Person Email</Table.Th>
                                    <Table.Td>{data.registrarMasterBranch?.emailContactPerson}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Contact Person Phone</Table.Th>
                                    <Table.Td>{data.registrarMasterBranch?.phoneContactPerson}</Table.Td>
                                </Table.Tr>
                            </Table.Thead>
                        </Table>
                    </Table.ScrollContainer>
                </>}
            </div>
        </SimpleGrid>
        <Box bg="transparent" mt="md">
            <div style={{textAlign: 'center'}}>
                <Text size="xl" fw={700} p="sm" >Name Change Masters</Text>
            </div>
            <NameChangeMastersListPage />
        </Box>
        <Box bg="transparent" mt="md">
            <div style={{textAlign: 'center'}}>
                <Text size="xl" fw={700} p="sm" >Corporate Masters</Text>
            </div>
            <CorporateMastersListPage />
        </Box>
    </ErrorBoundary>
  );
}

export default CompanyMasterDetail