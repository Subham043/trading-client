import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { ReferralTrackerStageType } from "../../utils/types";
import { ReferralTrackerStagesListDrawerProps, ReferralTrackerStagesListModalProps } from "../../pages/referralTrackerStages/list";
import { useDeleteReferralTrackerStageMutation, useReferralTrackerStagesQuery } from "../../hooks/data/referral_tracker_stages";
import ErrorBoundary from "../Layout/ErrorBoundary";
import dayjs from "dayjs";


const ReferralTrackerStagesTableRow:FC<ReferralTrackerStageType & {toggleModal: (value: ReferralTrackerStagesListModalProps) => void, toggleDrawer: (value: ReferralTrackerStagesListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, amount, status, paymentTrackerID, date, createdAt, toggleDrawer, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteReferralTrackerStages = useDeleteReferralTrackerStageMutation(id, paymentTrackerID||0)
  const onDelete = async () => {
    await deleteReferralTrackerStages.mutateAsync(undefined)
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
              {id}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {amount}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {status}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {date ? dayjs(date?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY') : ''}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon  variant="subtle" color="gray" onClick={() => toggleDrawer({drawerStatus: true, id: id})}>
                <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteReferralTrackerStages.isPending} disabled={deleteReferralTrackerStages.isPending}>
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

const ReferralTrackerStagesTable:FC<{toggleModal: (value: ReferralTrackerStagesListModalProps) => void, toggleDrawer: (value: ReferralTrackerStagesListDrawerProps) => void, paymentTrackerId: number, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:referralTrackerStages, isFetching, isLoading, status, error, refetch} = useReferralTrackerStagesQuery({paymentTrackerId: props.paymentTrackerId});
  const allChecked = (referralTrackerStages ? referralTrackerStages.referralTrackerStages : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (referralTrackerStages ? referralTrackerStages.referralTrackerStages : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={referralTrackerStages ? referralTrackerStages.referralTrackerStages.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={referralTrackerStages?.total} current_page={referralTrackerStages?.current_page} last_page={referralTrackerStages?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (referralTrackerStages ? referralTrackerStages.referralTrackerStages.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>ID</Table.Th>
              <Table.Th style={{color: 'white'}}>Amount</Table.Th>
              <Table.Th style={{color: 'white'}}>Status</Table.Th>
              <Table.Th style={{color: 'white'}}>Date</Table.Th>
              <Table.Th style={{color: 'white'}}>Created At</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (referralTrackerStages ? referralTrackerStages.referralTrackerStages : []).map((item) => <ReferralTrackerStagesTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default ReferralTrackerStagesTable