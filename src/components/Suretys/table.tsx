import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox, Tooltip } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { SuretyType } from "../../utils/types";
import dayjs from 'dayjs';
import { SuretysListModalProps } from "../../pages/suretys/list";
import { useDeleteSuretyMutation, useSuretysQuery } from "../../hooks/data/suretys";
import ErrorBoundary from "../Layout/ErrorBoundary";


const SuretysTableRow:FC<SuretyType & {toggleModal: (value: SuretysListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, projectID, companyName, fullName, age, isEmployed, isProperty, isBusiness, createdAt, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteSuretys = useDeleteSuretyMutation(id, projectID?.toString() ?? '');

  const onDelete = async () => {
    await deleteSuretys.mutateAsync(undefined)
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
              {companyName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {fullName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {age}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {isEmployed}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {isBusiness}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {isProperty}
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteSuretys.isPending} disabled={deleteSuretys.isPending}>
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

const SuretysTable:FC<{projectId: string, toggleModal: (value: SuretysListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:suretys, isFetching, isLoading, status, error, refetch} = useSuretysQuery(props.projectId);
  const allChecked = (suretys ? suretys.suretys : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (suretys ? suretys.suretys : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={suretys ? suretys.suretys.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={suretys?.total} current_page={suretys?.current_page} last_page={suretys?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (suretys ? suretys.suretys.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>ID</Table.Th>
              <Table.Th style={{color: 'white'}}>Company Name</Table.Th>
              <Table.Th style={{color: 'white'}}>Full Name</Table.Th>
              <Table.Th style={{color: 'white'}}>Age</Table.Th>
              <Table.Th style={{color: 'white'}}>Is Employed</Table.Th>
              <Table.Th style={{color: 'white'}}>Is Self-Occupied/Business</Table.Th>
              <Table.Th style={{color: 'white'}}>Own Property</Table.Th>
              <Table.Th style={{color: 'white'}}>Created At</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (suretys ? suretys.suretys : []).map((item) => <SuretysTableRow key={item.id} {...item} toggleModal={props.toggleModal} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default SuretysTable