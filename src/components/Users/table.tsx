import { FC } from "react"
import { Avatar, Badge, Table, Group, Text, ActionIcon, Anchor, rem, Popover, Center, Pagination, LoadingOverlay, Box } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';


const data = [
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',
    job: 'Engineer',
    email: 'rob_wolf@gmail.com',
    phone: '+44 (452) 886 09 12',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
    phone: '+44 (934) 777 12 76',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
    phone: '+44 (901) 384 88 34',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
    phone: '+44 (667) 341 45 22',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
    phone: '+44 (881) 245 65 65',
  },
];

const jobColors: Record<string, string> = {
  engineer: 'blue',
  manager: 'cyan',
  designer: 'pink',
};

const UserTable:FC = () => {
    const rows = data.map((item) => (
        <Table.Tr key={item.name}>
          <Table.Td>
              <Group gap="sm">
              <Avatar size={30} src={item.avatar} radius={30} />
              <Text fz="sm" fw={500}>
                  {item.name}
              </Text>
              </Group>
          </Table.Td>

          <Table.Td>
              <Badge color={jobColors[item.job.toLowerCase()]} variant="light">
              {item.job}
              </Badge>
          </Table.Td>
          <Table.Td>
              <Anchor component="button" size="sm">
              {item.email}
              </Anchor>
          </Table.Td>
          <Table.Td>
              <Text fz="sm">{item.phone}</Text>
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
    ));

  return (
    <Box pos="relative">
      <LoadingOverlay visible={false} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Employee</Table.Th>
              <Table.Th>Job title</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Center mt="md" pb="sm">
        <Pagination total={10} />
      </Center>
    </Box>
  );
}

export default UserTable