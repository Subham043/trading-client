import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { RegistrarMasterBranchQueryType } from "../../utils/types";
import dayjs from 'dayjs';
import { RegistrarMasterBranchesListDrawerProps, RegistrarMasterBranchesListModalProps } from "../../pages/registrarMasterBranches/list";
import { useDeleteRegistrarMasterBranchMutation, useRegistrarMasterBranchesQuery } from "../../hooks/data/registrar_master_branches";
import ErrorBoundary from "../Layout/ErrorBoundary";


const RegistrarMasterBranchesTableRow:FC<RegistrarMasterBranchQueryType & {toggleModal: (value: RegistrarMasterBranchesListModalProps) => void, toggleDrawer: (value: RegistrarMasterBranchesListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, registrarMasterID, branch, city, state, pincode, createdAt, toggleDrawer, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteRegistrarMasterBranches = useDeleteRegistrarMasterBranchMutation(id, registrarMasterID||0)
  const onDelete = async () => {
    await deleteRegistrarMasterBranches.mutateAsync(undefined)
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
              {branch}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {city}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {state}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {pincode}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon  variant="subtle" color="gray" onClick={() => toggleDrawer({drawerStatus: true, id: id})}>
                <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" onClick={() => toggleModal({status: true, type: 'Edit', id: id})}>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteRegistrarMasterBranches.isPending} disabled={deleteRegistrarMasterBranches.isPending}>
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

const RegistrarMasterBranchesTable:FC<{toggleModal: (value: RegistrarMasterBranchesListModalProps) => void, toggleDrawer: (value: RegistrarMasterBranchesListDrawerProps) => void, registrarMasterId: number, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:registrarMasterBranches, isFetching, isLoading, status, error, refetch} = useRegistrarMasterBranchesQuery({registrarMasterId: props.registrarMasterId});
  const allChecked = (registrarMasterBranches ? registrarMasterBranches.registrarMasterBranch : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (registrarMasterBranches ? registrarMasterBranches.registrarMasterBranch : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={registrarMasterBranches ? registrarMasterBranches.registrarMasterBranch.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={registrarMasterBranches?.total} current_page={registrarMasterBranches?.current_page} last_page={registrarMasterBranches?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (registrarMasterBranches ? registrarMasterBranches.registrarMasterBranch.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Branch</Table.Th>
              <Table.Th style={{color: 'white'}}>City</Table.Th>
              <Table.Th style={{color: 'white'}}>State</Table.Th>
              <Table.Th style={{color: 'white'}}>Pincode</Table.Th>
              <Table.Th style={{color: 'white'}}>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (registrarMasterBranches ? registrarMasterBranches.registrarMasterBranch : []).map((item) => <RegistrarMasterBranchesTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default RegistrarMasterBranchesTable