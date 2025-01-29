import { FC } from "react";
import { Badge, Divider, Group, Table, Text } from '@mantine/core';
import { useFoliosDividendMasterQuery } from "../../hooks/data/folios";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

const FolioDividendMasterPage:FC<{id: number}> = (props) => {
    const {data, isFetching, isLoading, status, error,  refetch} = useFoliosDividendMasterQuery({id: props.id, enabled: true});
    return (
        <>
            <Divider
                mb="md" 
                variant="dashed"
                label={
                    <Group justify="center">
                        <Badge variant="filled" size="lg">
                        Dividend Action
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />
            <ErrorBoundary hasData={data ? data.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} total={data?.length ?? 0} refetch={refetch}>
                <Table.ScrollContainer minWidth={700}>
                    <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                    <Table.Thead bg="blue">
                        <Table.Tr>
                        <Table.Th style={{color: 'white'}}>Recorded Date</Table.Th>
                        <Table.Th style={{color: 'white'}}>Financial Year</Table.Th>
                        <Table.Th style={{color: 'white'}}>Dividend Per Share</Table.Th>
                        <Table.Th style={{color: 'white'}}>No. Of Share</Table.Th>
                        <Table.Th style={{color: 'white'}}>Total Dividend</Table.Th>
                        <Table.Th style={{color: 'white'}}>Cumulative Dividend</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{
                        (data ? data : []).map(({recorded_date, financial_year, dividend_per_share, no_of_shares, total_dividend, cumulative_dividend}, i) => <Table.Tr key={i}>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {dayjs(recorded_date?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {financial_year}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {dividend_per_share}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {no_of_shares}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {total_dividend}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {cumulative_dividend}
                                </Text>
                            </Table.Td>
                        </Table.Tr>)
                    }</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </ErrorBoundary>
        </>
    )
}

export default FolioDividendMasterPage;