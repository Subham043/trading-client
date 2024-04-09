import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover } from '@mantine/core';
import { IconCheck, IconEye, IconTrash, IconX } from '@tabler/icons-react';
import { NameChangeMasterType } from "../../utils/types";
import dayjs from 'dayjs';
import { NameChangeMastersListDrawerProps, NameChangeMastersListModalProps } from "../../pages/nameChangeMasters/list";
import { useDeleteNameChangeMasterMutation, useNameChangeMastersQuery } from "../../hooks/data/name_change_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";


const NameChangeMasterTableRow:FC<NameChangeMasterType & {toggleModal: (value: NameChangeMastersListModalProps) => void, toggleDrawer: (value: NameChangeMastersListDrawerProps) => void,}> = ({id, companyId, currentName, BSE, NSE, previousName, dateNameChange, createdAt, toggleDrawer}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteNameChangeMaster = useDeleteNameChangeMasterMutation(id, companyId)
  const onDelete = async () => {
    await deleteNameChangeMaster.mutateAsync(undefined)
  }
  return (
    <Table.Tr>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {currentName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {previousName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dateNameChange && dayjs(dateNameChange.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {BSE}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {NSE}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon  variant="subtle" color="gray" onClick={() => toggleDrawer({drawerStatus: true, id: id})}>
                <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            {/* <ActionIcon variant="subtle" color="gray" onClick={() => toggleModal({status: true, type: 'Edit', id: id})}>
                <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon> */}
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteNameChangeMaster.isPending} disabled={deleteNameChangeMaster.isPending}>
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

const NameChangeMasterTable:FC<{toggleModal: (value: NameChangeMastersListModalProps) => void, toggleDrawer: (value: NameChangeMastersListDrawerProps) => void, companyId: number}> = (props) => {
  const {data:nameChangeMasters, isFetching, isLoading, status, error, refetch} = useNameChangeMastersQuery({companyId: props.companyId});
  return (
    <ErrorBoundary hasData={nameChangeMasters ? nameChangeMasters.nameChangeMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} current_page={nameChangeMasters?.current_page} last_page={nameChangeMasters?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>New Name</Table.Th>
              <Table.Th style={{color: 'white'}}>Previous Name</Table.Th>
              <Table.Th style={{color: 'white'}}>Date of Name Change</Table.Th>
              <Table.Th style={{color: 'white'}}>BSE</Table.Th>
              <Table.Th style={{color: 'white'}}>NSE</Table.Th>
              <Table.Th style={{color: 'white'}}>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (nameChangeMasters ? nameChangeMasters.nameChangeMaster : []).map((item) => <NameChangeMasterTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default NameChangeMasterTable