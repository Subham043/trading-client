import { FC, useState } from "react"
import { Avatar, Badge, Table, Group, Text, ActionIcon, Anchor, rem, Popover } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { UserQueryType } from "../../utils/types";
import dayjs from 'dayjs';
import { UserDrawerProps } from "../../pages/users";
import { useDeleteUserMutation, useUsersQuery } from "../../hooks/data/users";
import ErrorBoundary from "../Layout/ErrorBoundary";

const roleColors: Record<string, string> = {
  admin: 'blue',
  user: 'yellow',
};

const statusColors: Record<string, string> = {
  active: 'green',
  blocked: 'red',
};

const UserTableRow:FC<UserQueryType & {toggleDrawer: (value: UserDrawerProps) => void}> = ({id, name, email, role, status, createdAt, toggleDrawer}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteUser = useDeleteUserMutation(id);
  const initials = name.split(' ').map((name) => name[0]).join('').toUpperCase();
  const onDelete = async () => await deleteUser.mutateAsync();
  return (
    <Table.Tr>
      <Table.Td>
          <Group gap="sm">
          <Avatar size={30} radius={30}>{initials}</Avatar>
          <Text fz="sm" fw={500}>
              {name}
          </Text>
          </Group>
      </Table.Td>
      <Table.Td>
          <Anchor href={`mailto:${email}`} component="a" size="sm">
          {email}
          </Anchor>
      </Table.Td>
      <Table.Td>
          <Badge color={roleColors[role.toLowerCase()]} variant="light">
          {role}
          </Badge>
      </Table.Td>
      <Table.Td>
          <Badge color={statusColors[status.toLowerCase()]} variant="light">
          {status}
          </Badge>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon variant="subtle" color="gray" onClick={() => toggleDrawer({status: true, type: 'Edit', id: id})}>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteUser.isPending} disabled={deleteUser.isPending}>
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

const UserTable:FC<{toggleDrawer: (value: UserDrawerProps) => void}> = (props) => {
  const {data:users, isFetching, isLoading, status, error, refetch} = useUsersQuery();
  
  return (
    <>
      <ErrorBoundary hasData={users ? users.user.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} current_page={users?.current_page} last_page={users?.last_page} refetch={refetch}>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
            <Table.Thead bg="blue">
              <Table.Tr>
                <Table.Th style={{color: 'white'}}>Name</Table.Th>
                <Table.Th style={{color: 'white'}}>Email</Table.Th>
                <Table.Th style={{color: 'white'}}>Role</Table.Th>
                <Table.Th style={{color: 'white'}}>Status</Table.Th>
                <Table.Th style={{color: 'white'}}>Created On</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{
              (users ? users.user : []).map((item) => <UserTableRow key={item.id} {...item} toggleDrawer={props.toggleDrawer} />)
            }</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ErrorBoundary>
    </>
  );
}

export default UserTable