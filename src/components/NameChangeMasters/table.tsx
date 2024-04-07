import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Center, Pagination, LoadingOverlay, Box } from '@mantine/core';
import { IconCheck, IconEye, IconTrash, IconX } from '@tabler/icons-react';
import { NameChangeMasterType } from "../../utils/types";
import { useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { DrawerProps, ModalProps } from "../../pages/nameChangeMasters/list";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useToast } from "../../hooks/useToast";
import { AxiosError } from "axios";
import { useDeleteNameChangeMaster, useNameChangeMasters } from "../../hooks/data/name_change_masters";


const NameChangeMasterTableRow:FC<NameChangeMasterType & {toggleModal: (value: ModalProps) => void, toggleDrawer: (value: DrawerProps) => void,}> = ({id, companyId, newName, BSE, NSE, previousName, dateNameChange, createdAt, toggleDrawer}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const deleteNameChangeMaster = useDeleteNameChangeMaster(id, companyId)
  const {toastError, toastSuccess} = useToast();
  const onDelete = () => {
    setLoading(true);
    deleteNameChangeMaster.mutateAsync(undefined,{
      onSuccess: () => toastSuccess("Name Change Master deleted successfully."),
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
          <Text fz="sm" fw={500}>
              {newName}
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

const NameChangeMasterTable:FC<{toggleModal: (value: ModalProps) => void, toggleDrawer: (value: DrawerProps) => void, companyId: number}> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {data:nameChangeMasters, isFetching, isLoading} = useNameChangeMasters({companyId: props.companyId, page: searchParams.get('page') || QueryInitialPageParam.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: searchParams.get('search') || ''});
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading || isFetching} zIndex={30} overlayProps={{ radius: "sm", blur: 2 }} />
      {(nameChangeMasters && nameChangeMasters.nameChangeMaster.length>0) ? <>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>New Name</Table.Th>
                <Table.Th>Previous Name</Table.Th>
                <Table.Th>Date of Name Change</Table.Th>
                <Table.Th>BSE</Table.Th>
                <Table.Th>NSE</Table.Th>
                <Table.Th>Created On</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{
              (nameChangeMasters ? nameChangeMasters.nameChangeMaster : []).map((item) => <NameChangeMasterTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} />)
            }</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <Center mt="md" pb="sm">
          <Pagination value={nameChangeMasters?.current_page || 10} total={nameChangeMasters?.last_page || 10} onChange={(page) => setSearchParams(page ? {page: page.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: searchParams.get('search') || ''} : {})} />
        </Center>
      </>: 
      <Center mt="md" pb="sm" pt="sm">
        <Text>No data found</Text>
      </Center>}
    </Box>
  );
}

export default NameChangeMasterTable