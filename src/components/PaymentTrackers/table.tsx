import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { PaymentTrackerType } from "../../utils/types";
import dayjs from 'dayjs';
import { PaymentTrackersListModalProps } from "../../pages/paymentTrackers/list";
import { useDeletePaymentTrackerMutation, usePaymentTrackersQuery } from "../../hooks/data/payment_trackers";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { Link } from "react-router-dom";
import { page_routes } from "../../utils/page_routes";


const PaymentTrackersTableRow:FC<PaymentTrackerType & {toggleModal: (value: PaymentTrackersListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, projectID, percentageTotal, percentageStage, noOfStages, noOfStagesReferral, percentageStageReferral, tdsPercentage, amountReferral, valuation, createdAt, tdsFlag, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deletePaymentTrackers = useDeletePaymentTrackerMutation(id, projectID?.toString() ?? '');
  const onDelete = async () => {
    await deletePaymentTrackers.mutateAsync(undefined)
  }
  return (
    <Table.Tr>
      <Table.Td>
        <Checkbox
          checked={selectedData.includes(id)}
          onChange={() => setSelectedData(selectedData.includes(id) ? selectedData.filter((value) => value !== id) : [...selectedData, id])}
          color="gray"
        />
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {valuation}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {percentageTotal}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
            {noOfStages}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {percentageStage}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {noOfStagesReferral}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {percentageStageReferral}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {amountReferral}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {tdsFlag}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {tdsFlag==="Yes" ? tdsPercentage : ''}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <Link to={`${page_routes.paymentTrackers.list}/${id}`}>
              <ActionIcon  variant="subtle" color="gray">
                  <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Link>
            <ActionIcon variant="subtle" color="gray" onClick={() => toggleModal({status: true, type: 'Edit', id: id})}>
                <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            <Popover width={200} opened={opened} onChange={setOpened} trapFocus position="bottom-end" withArrow shadow="md" clickOutsideEvents={['mouseup', 'touchend']}>
              <Popover.Target>
                <ActionIcon variant="subtle" color="red" onClick={() => setOpened((o) => !o)}>
                    <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Group gap={0} justify="space-between">
                  <Text size="sm">Are you sure?</Text>
                  <Group gap={0}>
                    <ActionIcon variant="subtle" color="gray" onClick={() => setOpened((o) => !o)}>
                        <IconX style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deletePaymentTrackers.isPending} disabled={deletePaymentTrackers.isPending}>
                        <IconCheck style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Popover.Dropdown>
            </Popover>
          </Group>
      </Table.Td>
    </Table.Tr>
  )
}

const PaymentTrackersTable:FC<{projectId: string, toggleModal: (value: PaymentTrackersListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:paymentTrackers, isFetching, isLoading, status, error, refetch} = usePaymentTrackersQuery(props.projectId);
  const allChecked = (paymentTrackers ? paymentTrackers.paymentTracker : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (paymentTrackers ? paymentTrackers.paymentTracker : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={paymentTrackers ? paymentTrackers.paymentTracker.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={paymentTrackers?.total} current_page={paymentTrackers?.current_page} last_page={paymentTrackers?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (paymentTrackers ? paymentTrackers.paymentTracker.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Valuation</Table.Th>
              <Table.Th style={{color: 'white'}}>Percentage of Valuation</Table.Th>
              <Table.Th style={{color: 'white'}}>No. Of Stages</Table.Th>
              <Table.Th style={{color: 'white'}}>Percentage of Each Stages</Table.Th>
              <Table.Th style={{color: 'white'}}>No. Of Stages For Referral</Table.Th>
              <Table.Th style={{color: 'white'}}>Percentage of Each Stages For Referral</Table.Th>
              <Table.Th style={{color: 'white'}}>Referral Amount</Table.Th>
              <Table.Th style={{color: 'white'}}>TDS Flag</Table.Th>
              <Table.Th style={{color: 'white'}}>TDS Percentage</Table.Th>
              <Table.Th style={{color: 'white'}}>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (paymentTrackers ? paymentTrackers.paymentTracker : []).map((item) => <PaymentTrackersTableRow key={item.id} {...item} toggleModal={props.toggleModal} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default PaymentTrackersTable