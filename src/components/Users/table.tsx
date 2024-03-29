import { FC, useState } from "react"
import { Avatar, Badge, Table, Group, Text, ActionIcon, Anchor, rem, Popover, Center, Pagination, LoadingOverlay, Box } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { useUsersQuery } from "../../hooks/data/useUsersQuery";
import { UserQueryType } from "../../utils/types";
import { useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { DrawerProps } from "../../pages/users";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useDeleteUserQuery } from "../../hooks/data/useUserQuery";
import { useToast } from "../../hooks/useToast";
import { AxiosError } from "axios";

const roleColors: Record<string, string> = {
  admin: 'blue',
  user: 'yellow',
};

const statusColors: Record<string, string> = {
  active: 'green',
  blocked: 'red',
};

const UserTableRow:FC<UserQueryType & {toggleDrawer: (value: DrawerProps) => void}> = ({id, name, email, role, status, createdAt, toggleDrawer}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const deleteUser = useDeleteUserQuery(id)
  const {toastError, toastSuccess} = useToast();
  const initials = name.split(' ').map((name) => name[0]).join('').toUpperCase();
  const onDelete = () => {
    setLoading(true);
    deleteUser.mutateAsync(undefined,{
      onSuccess: () => toastSuccess("User deleted successfully."),
      onError: (error:Error) => {
          if(error instanceof AxiosError){
              if(error?.response?.data?.message){
                  toastError(error.response.data.message);
              }
          }else{
              toastError('Something went wrong. Please try again later.');
          }
      },
      onSettled: () => setLoading(false)
    })
  }
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
          <Anchor component="button" size="sm">
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={loading}>
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

const UserTable:FC<{toggleDrawer: (value: DrawerProps) => void}> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {data:users, isFetching, isLoading} = useUsersQuery({page: searchParams.get('page') || QueryInitialPageParam.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: searchParams.get('search') || ''});
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading || isFetching} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (users ? users.user : []).map((item) => <UserTableRow key={item.id} {...item} toggleDrawer={props.toggleDrawer} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Center mt="md" pb="sm">
        <Pagination value={users?.current_page || 10} total={users?.last_page || 10} onChange={(page) => setSearchParams(page ? {page: page.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: searchParams.get('search') || ''} : {})} />
      </Center>
    </Box>
  );
}

export default UserTable