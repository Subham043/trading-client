import { FC } from "react"
import { Avatar, Badge, Table, Group, Text, ActionIcon, Anchor, rem, Popover, Center, Pagination, LoadingOverlay, Box } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { useUsersQuery } from "../../hooks/data/useUsersQuery";
import { UserQueryType } from "../../utils/types";
import { useSearchParams } from "react-router-dom";

const roleColors: Record<string, string> = {
  admin: 'blue',
  user: 'yellow',
};

const statusColors: Record<string, string> = {
  active: 'green',
  blocked: 'red',
};

const UserTableRow:FC<UserQueryType> = ({name, email, role, status}) => {
  const initials = name.split(' ').map((name) => name[0]).join('').toUpperCase();
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
          <Group gap={0} justify="flex-end">
            <ActionIcon variant="subtle" color="gray">
                <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            <Popover width={200} trapFocus position="bottom-end" withArrow shadow="md" clickOutsideEvents={['mouseup', 'touchend']}>
              <Popover.Target>
                <ActionIcon variant="subtle" color="red">
                    <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Group gap={0} justify="space-between">
                  <Text size="sm">Are you sure?</Text>
                  <Group gap={0}>
                    <ActionIcon variant="subtle" color="gray">
                        <IconX style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red">
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

const UserTable:FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {data:users, isFetching, isLoading} = useUsersQuery({page: searchParams.get('page') || '1', limit: searchParams.get('limit') || '5', search: searchParams.get('search') || ''});
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
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (users ? users.user : []).map((item) => <UserTableRow key={item.id} {...item} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Center mt="md" pb="sm">
        <Pagination total={users?.last_page || 10} onChange={(page) => setSearchParams(page ? {page: page.toString(), limit: searchParams.get('limit') || '5', search: searchParams.get('search') || ''} : {})} />
      </Center>
    </Box>
  );
}

export default UserTable