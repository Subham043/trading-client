import { FC, useState } from "react";
import { Badge, Divider, Group, Flex, Table, Text } from '@mantine/core';
import { useFoliosCorporateMasterQuery } from "../../hooks/data/folios";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";
import RightSelect from "./rightSelect";
import type { MultiValue } from "react-select";

type OptionType = {
 value: number;
 label: string;
};

const FolioCorporateMasterPage:FC<{id: number}> = (props) => {
    const [rights, setRights] = useState<MultiValue<OptionType>>([]);
    const {data, isFetching, isLoading, status, error,  refetch} = useFoliosCorporateMasterQuery({
        id: props.id, 
        rights: rights.length>0 ? rights.map(i => i.value).join(";") : undefined,
        enabled: true
    });
    return (
        <>
            <Divider
                mb="md" 
                variant="dashed"
                label={
                    <Group justify="center">
                        <Badge variant="filled" size="lg">
                        Corporate Action
                        </Badge>
                    </Group>
                } 
                labelPosition="center" 
            />
            <Flex justify="flex-end" mt="md" mb="md">
                <div style={{maxWidth: 300}}>
                    <RightSelect folioId={props.id} value={rights} setValue={(value) => setRights(value)} />
                </div>
            </Flex>
            <ErrorBoundary hasData={data ? data.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} total={data?.length ?? 0} refetch={refetch}>
                <Table.ScrollContainer minWidth={700}>
                    <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                    <Table.Thead bg="blue">
                        <Table.Tr>
                        <Table.Th style={{color: 'white'}}>Date</Table.Th>
                        <Table.Th style={{color: 'white'}}>Type</Table.Th>
                        <Table.Th style={{color: 'white'}}>Numerator</Table.Th>
                        <Table.Th style={{color: 'white'}}>Denominator</Table.Th>
                        <Table.Th style={{color: 'white'}}>Original Holding</Table.Th>
                        <Table.Th style={{color: 'white'}}>Bonus / Split/ Rights/ Share exchange</Table.Th>
                        <Table.Th style={{color: 'white'}}>Consolidated holdings</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{
                        (data ? data : []).map(({date, type, numerator, denominator, originalHolding, exchange, consolidatedHolding}, i) => <Table.Tr key={i}>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {dayjs(date?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {type}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {numerator}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {denominator}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {originalHolding}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {exchange}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="sm" fw={500}>
                                    {consolidatedHolding}
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

export default FolioCorporateMasterPage;