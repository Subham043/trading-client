import { FC } from "react"
import { Box, Button, Group, rem, Table, Tabs, Text } from '@mantine/core';
import { useProjectQuery } from "../../hooks/data/projects";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { ProjectsListModalProps } from "../../pages/projects/list";
import { IconBrandHipchat, IconCertificate, IconChartBar, IconFileSpreadsheet, IconReceiptRupee, IconUserExclamation, IconUsers } from "@tabler/icons-react";
import { page_routes } from "../../utils/page_routes";

const iconStyle = { width: rem(12), height: rem(12) };

const ProjectDetail:FC<{toggleModal: (value: ProjectsListModalProps) => void}> = (props) => {
    const param = useParams<{projectId: string}>();
    const location = useLocation();
    const navigate = useNavigate();
  const {data, isFetching, isLoading, status, error, refetch} = useProjectQuery(Number(param.projectId), true);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        <Group justify="space-between" mb="lg" align="center">
            <Text size="xl" fw={700}>Project Detail</Text>
            <Button type='submit' variant="filled" color='blue' onClick={() => props.toggleModal({status: true, type: 'Edit', id: Number(param.projectId)})}>
                Edit
            </Button>
        </Group>
        {(data) && <>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                    <Table.Thead bg="blue">
                        <Table.Tr>
                            <Table.Th style={{color: 'white'}}>ID</Table.Th>
                            <Table.Th style={{color: 'white'}}>Name</Table.Th>
                            <Table.Th style={{color: 'white'}}>Total Consolidated Holdings</Table.Th>
                            <Table.Th style={{color: 'white'}}>Total Valuation In NSE/BSE</Table.Th>
                            <Table.Th style={{color: 'white'}}>Created On</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>{data.id}</Table.Td>
                            <Table.Td>{data.name}</Table.Td>
                            <Table.Td>{data.totalShares}</Table.Td>
                            <Table.Td>{data.totalValuationInNse} / {data.totalValuationInBse}</Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {(data && data.createdAt) && dayjs(data.createdAt.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </>}
        <Box bg="transparent" mt="md">
            <Tabs value={location.pathname} onChange={(value) =>  value ? navigate(value) : undefined}>
                <Tabs.List justify="center">
                    <Tabs.Tab value={`${page_routes.projects.list}/${param.projectId}/share-holder-details`} leftSection={<IconUserExclamation style={iconStyle} />}>
                        Share Holders
                    </Tabs.Tab>
                    <Tabs.Tab value={`${page_routes.projects.list}/${param.projectId}/legal-heir-details`} leftSection={<IconUsers style={iconStyle} />}>
                        Legal Heirs
                    </Tabs.Tab>
                    <Tabs.Tab value={`${page_routes.projects.list}/${param.projectId}/nomination`} leftSection={<IconFileSpreadsheet style={iconStyle} />}>
                        Nomination
                    </Tabs.Tab>
                    <Tabs.Tab value={`${page_routes.projects.list}/${param.projectId}/share-certificate-masters`} leftSection={<IconCertificate style={iconStyle} />}>
                        Share Certificate Masters
                    </Tabs.Tab>
                    <Tabs.Tab value={`${page_routes.projects.list}/${param.projectId}/payment-trackers`} leftSection={<IconReceiptRupee style={iconStyle} />}>
                        Payment Trackers
                    </Tabs.Tab>
                    <Tabs.Tab value={`${page_routes.projects.list}/${param.projectId}/stage-trackers`} leftSection={<IconChartBar style={iconStyle} />}>
                        Stage Trackers
                    </Tabs.Tab>
                    <Tabs.Tab value={`${page_routes.projects.list}/${param.projectId}/communication-trackers`} leftSection={<IconBrandHipchat style={iconStyle} />}>
                        Communication Trackers
                    </Tabs.Tab>
                    <Tabs.Tab value={`${page_routes.projects.list}/${param.projectId}/iepf-trackers`} leftSection={<IconFileSpreadsheet style={iconStyle} />}>
                        IEPF
                    </Tabs.Tab>
                    <Tabs.Tab value={`${page_routes.projects.list}/${param.projectId}/surety`} leftSection={<IconFileSpreadsheet style={iconStyle} />}>
                        Surety
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>
            <Box bg="transparent" mt="md">
                <Outlet />
            </Box>
        </Box>
    </ErrorBoundary>
  );
}

export default ProjectDetail