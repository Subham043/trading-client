import { FC } from "react"
import { Box, Button, Group, Table, Text } from '@mantine/core';
import { usePaymentTrackerQuery } from "../../hooks/data/payment_trackers";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { useParams } from "react-router-dom";
import { PaymentTrackersListModalProps } from "../../pages/paymentTrackers/list";
import PaymentTrackerStagesListPage from "../../pages/paymentTrackerStages/list";
import ReferralTrackerStagesListPage from "../../pages/referralTrackerStages/list";

const PaymentTrackerDetail:FC<{toggleModal: (value: PaymentTrackersListModalProps) => void}> = (props) => {
    const param = useParams<{paymentTrackerId: string}>();
  const {data, isFetching, isLoading, status, error, refetch} = usePaymentTrackerQuery(Number(param.paymentTrackerId), true);
  return (
    <ErrorBoundary hasData={data ? true : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} refetch={refetch}>
        <Group justify="space-between" mb="lg" align="center">
            <Text size="xl" fw={700}>Payment Tracker Detail</Text>
            <Button type='submit' variant="filled" color='blue' onClick={() => props.toggleModal({status: true, type: 'Edit', id: Number(param.paymentTrackerId)})}>
                Edit
            </Button>
        </Group>
        {(data) && <>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                    <Table.Thead bg="blue">
                        <Table.Tr>
                            <Table.Th style={{color: 'white'}}>ID</Table.Th>
                            <Table.Th style={{color: 'white'}}>Valuation</Table.Th>
                            <Table.Th style={{color: 'white'}}>Percentage of Valuation</Table.Th>
                            <Table.Th style={{color: 'white'}}>No. Of Stages</Table.Th>
                            <Table.Th style={{color: 'white'}}>Percentage of Each Stages</Table.Th>
                            <Table.Th style={{color: 'white'}}>No. Of Stages For Referral</Table.Th>
                            <Table.Th style={{color: 'white'}}>Percentage of Each Stages For Referral</Table.Th>
                            <Table.Th style={{color: 'white'}}>Referral Amount</Table.Th>
                            <Table.Th style={{color: 'white'}}>TDS Flag</Table.Th>
                            <Table.Th style={{color: 'white'}}>TDS Percentage</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>{data.id}</Table.Td>
                            <Table.Td>{data.valuation}</Table.Td>
                            <Table.Td>{data.percentageTotal}</Table.Td>
                            <Table.Td>{data.noOfStages}</Table.Td>
                            <Table.Td>{data.percentageStage}</Table.Td>
                            <Table.Td>{data.noOfStagesReferral}</Table.Td>
                            <Table.Td>{data.percentageStageReferral}</Table.Td>
                            <Table.Td>{data.amountReferral}</Table.Td>
                            <Table.Td>{data.tdsFlag}</Table.Td>
                            <Table.Td>{data.tdsFlag==="Yes" ? data.tdsPercentage : ""}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <Box bg="transparent" mt="md">
                <PaymentTrackerStagesListPage projectId={data.projectID || 0} />
            </Box>
            <Box bg="transparent" mt="lg">
                <ReferralTrackerStagesListPage projectId={data.projectID || 0} />
            </Box>
        </>}
    </ErrorBoundary>
  );
}

export default PaymentTrackerDetail