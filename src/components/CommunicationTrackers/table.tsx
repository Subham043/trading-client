import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox, Tooltip } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { CommunicationTrackerType } from "../../utils/types";
import dayjs from 'dayjs';
import { CommunicationTrackerDrawerProps, CommunicationTrackersListModalProps } from "../../pages/communicationTrackers/list";
import { useDeleteCommunicationTrackerMutation, useCommunicationTrackersQuery } from "../../hooks/data/communication_trackers";
import ErrorBoundary from "../Layout/ErrorBoundary";


const CommunicationTrackersTableRow:FC<CommunicationTrackerType & {toggleModal: (value: CommunicationTrackersListModalProps) => void, toggleDrawer: (value: CommunicationTrackerDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, projectID, foliosSet, dateSent, dateReceived, stage, selectedData, setSelectedData, toggleModal, toggleDrawer}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteCommunicationTrackers = useDeleteCommunicationTrackerMutation(id, projectID?.toString() ?? '');
  const onDelete = async () => {
    await deleteCommunicationTrackers.mutateAsync(undefined)
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
              {stage}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {foliosSet.map((value) => value.Folio+' ('+(value.currentNameChangeMasters?.currentName || '')+')').join(', ')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dateSent ? dayjs(dateSent?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY') : ''}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dateReceived ? dayjs(dateReceived?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY') : ''}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <Tooltip label="View">
              <ActionIcon  variant="subtle" color="gray" onClick={() => toggleDrawer({drawerStatus: true, id: id})}>
                  <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Edit">
              <ActionIcon variant="subtle" color="gray" onClick={() => toggleModal({status: true, type: 'Edit', id: id})}>
                  <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Popover width={200} opened={opened} onChange={setOpened} trapFocus position="bottom-end" withArrow shadow="md" clickOutsideEvents={['mouseup', 'touchend']}>
              <Popover.Target>
                <Tooltip label="Delete">
                  <ActionIcon variant="subtle" color="red" onClick={() => setOpened((o) => !o)}>
                      <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
                <Group gap={0} justify="space-between">
                  <Text size="sm">Are you sure?</Text>
                  <Group gap={0}>
                    <ActionIcon variant="subtle" color="gray" onClick={() => setOpened((o) => !o)}>
                        <IconX style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteCommunicationTrackers.isPending} disabled={deleteCommunicationTrackers.isPending}>
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

const CommunicationTrackersTable:FC<{projectId: string, toggleModal: (value: CommunicationTrackersListModalProps) => void, toggleDrawer: (value: CommunicationTrackerDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:communicationTrackers, isFetching, isLoading, status, error, refetch} = useCommunicationTrackersQuery(props.projectId);
  const allChecked = (communicationTrackers ? communicationTrackers.communicationTracker : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (communicationTrackers ? communicationTrackers.communicationTracker : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={communicationTrackers ? communicationTrackers.communicationTracker.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={communicationTrackers?.total} current_page={communicationTrackers?.current_page} last_page={communicationTrackers?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (communicationTrackers ? communicationTrackers.communicationTracker.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>ID</Table.Th>
              <Table.Th style={{color: 'white'}}>Stage</Table.Th>
              <Table.Th style={{color: 'white'}}>Company/Folios</Table.Th>
              <Table.Th style={{color: 'white'}}>Date Sent</Table.Th>
              <Table.Th style={{color: 'white'}}>Date Received</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (communicationTrackers ? communicationTrackers.communicationTracker : []).map((item) => <CommunicationTrackersTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default CommunicationTrackersTable