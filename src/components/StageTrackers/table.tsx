import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { StageTrackerType } from "../../utils/types";
import dayjs from 'dayjs';
import { StageTrackerDrawerProps, StageTrackersListModalProps } from "../../pages/stageTrackers/list";
import { useDeleteStageTrackerMutation, useStageTrackersQuery } from "../../hooks/data/stage_trackers";
import ErrorBoundary from "../Layout/ErrorBoundary";


const StageTrackersTableRow:FC<StageTrackerType & {toggleModal: (value: StageTrackersListModalProps) => void, toggleDrawer: (value: StageTrackerDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, projectID, pendingFrom, date, stage, createdAt, selectedData, setSelectedData, toggleModal, toggleDrawer}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteStageTrackers = useDeleteStageTrackerMutation(id, projectID?.toString() ?? '');
  const onDelete = async () => {
    await deleteStageTrackers.mutateAsync(undefined)
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
              {stage}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {pendingFrom}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(date?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteStageTrackers.isPending} disabled={deleteStageTrackers.isPending}>
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

const StageTrackersTable:FC<{projectId: string, toggleModal: (value: StageTrackersListModalProps) => void, toggleDrawer: (value: StageTrackerDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:stageTrackers, isFetching, isLoading, status, error, refetch} = useStageTrackersQuery(props.projectId);
  const allChecked = (stageTrackers ? stageTrackers.stageTracker : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (stageTrackers ? stageTrackers.stageTracker : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={stageTrackers ? stageTrackers.stageTracker.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={stageTrackers?.total} current_page={stageTrackers?.current_page} last_page={stageTrackers?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (stageTrackers ? stageTrackers.stageTracker.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Stage</Table.Th>
              <Table.Th style={{color: 'white'}}>Pending From</Table.Th>
              <Table.Th style={{color: 'white'}}>Date</Table.Th>
              <Table.Th style={{color: 'white'}}>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (stageTrackers ? stageTrackers.stageTracker : []).map((item) => <StageTrackersTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default StageTrackersTable