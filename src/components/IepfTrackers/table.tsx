import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox, Tooltip } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { IepfTrackerType } from "../../utils/types";
import dayjs from 'dayjs';
import { IepfTrackersListModalProps } from "../../pages/iepfTrackers/list";
import { useDeleteIepfTrackerMutation, useIepfTrackersQuery } from "../../hooks/data/iepf_trackers";
import ErrorBoundary from "../Layout/ErrorBoundary";


const IepfTrackersTableRow:FC<IepfTrackerType & {toggleModal: (value: IepfTrackersListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, projectID, shareHolderDetailSet, legalHeirDetailSet, createdAt, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteIepfTrackers = useDeleteIepfTrackerMutation(id, projectID?.toString() ?? '');
  const onDelete = async () => {
    await deleteIepfTrackers.mutateAsync(undefined)
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
              {shareHolderDetailSet.map((value) => (value.shareholderName || '')).join(', ')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {legalHeirDetailSet.map((value) => (value.namePan || '')).join(', ')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {createdAt ? dayjs(createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY') : ''}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteIepfTrackers.isPending} disabled={deleteIepfTrackers.isPending}>
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

const IepfTrackersTable:FC<{projectId: string, toggleModal: (value: IepfTrackersListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:iepfTrackers, isFetching, isLoading, status, error, refetch} = useIepfTrackersQuery(props.projectId);
  const allChecked = (iepfTrackers ? iepfTrackers.iepfTracker : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (iepfTrackers ? iepfTrackers.iepfTracker : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={iepfTrackers ? iepfTrackers.iepfTracker.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={iepfTrackers?.total} current_page={iepfTrackers?.current_page} last_page={iepfTrackers?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (iepfTrackers ? iepfTrackers.iepfTracker.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>ID</Table.Th>
              <Table.Th style={{color: 'white'}}>Share Holders</Table.Th>
              <Table.Th style={{color: 'white'}}>Legal Heirs</Table.Th>
              <Table.Th style={{color: 'white'}}>Created At</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (iepfTrackers ? iepfTrackers.iepfTracker : []).map((item) => <IepfTrackersTableRow key={item.id} {...item} toggleModal={props.toggleModal} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default IepfTrackersTable