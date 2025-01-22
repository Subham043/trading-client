import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox, Tooltip } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { NominationType } from "../../utils/types";
import dayjs from 'dayjs';
import { NominationsListModalProps } from "../../pages/nominations/list";
import { useDeleteNominationMutation, useNominationsQuery } from "../../hooks/data/nominations";
import ErrorBoundary from "../Layout/ErrorBoundary";


const NominationsTableRow:FC<NominationType & {toggleModal: (value: NominationsListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, projectID, fatherName, fullName, relationship, isMinor, isDeceased, createdAt, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteNominations = useDeleteNominationMutation(id, projectID?.toString() ?? '');

  const onDelete = async () => {
    await deleteNominations.mutateAsync(undefined)
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
              {fullName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {fatherName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {relationship}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {isMinor}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {isDeceased}
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteNominations.isPending} disabled={deleteNominations.isPending}>
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

const NominationsTable:FC<{projectId: string, toggleModal: (value: NominationsListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:nominations, isFetching, isLoading, status, error, refetch} = useNominationsQuery(props.projectId);
  const allChecked = (nominations ? nominations.nominations : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (nominations ? nominations.nominations : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={nominations ? nominations.nominations.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={nominations?.total} current_page={nominations?.current_page} last_page={nominations?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (nominations ? nominations.nominations.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>ID</Table.Th>
              <Table.Th style={{color: 'white'}}>Full Name</Table.Th>
              <Table.Th style={{color: 'white'}}>Father/Mother/Spouse Name</Table.Th>
              <Table.Th style={{color: 'white'}}>Relationship with security holder</Table.Th>
              <Table.Th style={{color: 'white'}}>Is Minor</Table.Th>
              <Table.Th style={{color: 'white'}}>Is Deceased</Table.Th>
              <Table.Th style={{color: 'white'}}>Created At</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (nominations ? nominations.nominations : []).map((item) => <NominationsTableRow key={item.id} {...item} toggleModal={props.toggleModal} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default NominationsTable