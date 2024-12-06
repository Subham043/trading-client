import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox, Anchor, Tooltip } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { RegistrarMasterType } from "../../utils/types";
import dayjs from 'dayjs';
import { RegistrarMastersModalProps } from "../../pages/registrarMasters/list";
import { useDeleteRegistrarMasterMutation, useRegistrarMastersQuery } from "../../hooks/data/registrar_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { Link } from "react-router-dom";
import { page_routes } from "../../utils/page_routes";


const RegistrarMasterTableRow:FC<RegistrarMasterType & {toggleModal: (value: RegistrarMastersModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, registrar_name, sebi_regn_id, createdAt, toggleModal, selectedData, setSelectedData}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteRegistrarMaster = useDeleteRegistrarMasterMutation(id)

  const onDelete = async () => {
    await deleteRegistrarMaster.mutateAsync(undefined)
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
          <Link to={`${page_routes.registrarMasters.list}/${id}`}>
            <Anchor component="button" size="sm">
            {id}
            </Anchor>
          </Link>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {registrar_name}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {sebi_regn_id}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt ? createdAt.toString() : undefined).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <Tooltip label="View">
              <Link to={`${page_routes.registrarMasters.list}/${id}`}>
                <ActionIcon  variant="subtle" color="gray">
                    <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
              </Link>
            </Tooltip>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteRegistrarMaster.isPending} disabled={deleteRegistrarMaster.isPending}>
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

const RegistrarMasterTable:FC<{toggleModal: (value: RegistrarMastersModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:registrarMasters, isFetching, isLoading, status, error, refetch} = useRegistrarMastersQuery();
  const allChecked = (registrarMasters ? registrarMasters.registrarMaster : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (registrarMasters ? registrarMasters.registrarMaster : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <>
      <ErrorBoundary hasData={registrarMasters ? registrarMasters.registrarMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={registrarMasters?.total} current_page={registrarMasters?.current_page} last_page={registrarMasters?.last_page} refetch={refetch}>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
            <Table.Thead bg="blue">
              <Table.Tr>
                <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (registrarMasters ? registrarMasters.registrarMaster.map((value) => value.id) : []))}
                  />
                </Table.Th>
                <Table.Th style={{color: 'white'}}>ID</Table.Th>
                <Table.Th style={{color: 'white'}}>Registrar Name</Table.Th>
                <Table.Th style={{color: 'white'}}>SEBI Regn. ID</Table.Th>
                <Table.Th style={{color: 'white'}}>Created On</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{
              (registrarMasters ? registrarMasters.registrarMaster : []).map((item) => <RegistrarMasterTableRow key={item.id} {...item} toggleModal={props.toggleModal} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
            }</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ErrorBoundary>
    </>
  );
}

export default RegistrarMasterTable