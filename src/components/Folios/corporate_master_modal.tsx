import { FC } from "react";
import { Modal, Table, Text } from '@mantine/core';
import { FoliosCorporateMasterModalProps } from "../../pages/folios/list";
import { useFoliosCorporateMasterQuery } from "../../hooks/data/folios";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";

const FolioCorporateMasterModal:FC<FoliosCorporateMasterModalProps & {toggleModal: (value: FoliosCorporateMasterModalProps) => void}> = (props) => {
    const {data, isFetching, isLoading, status, error,  refetch} = useFoliosCorporateMasterQuery(props.status ? {id: props.id, enabled: true} : {id: 0, enabled: false});
    return (
        <Modal opened={props.status} onClose={() => props.toggleModal({status: false})} centered size="xl" withCloseButton={true}  title="Corporate Action" overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
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
        </Modal>
    )
}

export default FolioCorporateMasterModal;