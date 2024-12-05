import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { SecurityTypeMasterType } from "../../utils/types";
import dayjs from 'dayjs';
import { SecurityTypeMastersListDrawerProps, SecurityTypeMastersListModalProps } from "../../pages/securityTypeMasters/list";
import { useDeleteSecurityTypeMasterMutation, useSecurityTypeMastersQuery } from "../../hooks/data/security_type_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";


const SecurityTypeMastersTableRow:FC<SecurityTypeMasterType & {toggleModal: (value: SecurityTypeMastersListModalProps) => void, toggleDrawer: (value: SecurityTypeMastersListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, instrumentType, companyMaster, Symbol, Series, dateOfListing, marketLot, createdAt, toggleDrawer, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteSecurityTypeMasters = useDeleteSecurityTypeMasterMutation(id)
  const onDelete = async () => {
    await deleteSecurityTypeMasters.mutateAsync(undefined)
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
              {instrumentType}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {companyMaster?.currentNameChangeMasters?.currentName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {Symbol}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {Series}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {marketLot}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dateOfListing ? dayjs(dateOfListing?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY') : ''}
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteSecurityTypeMasters.isPending} disabled={deleteSecurityTypeMasters.isPending}>
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

const SecurityTypeMastersTable:FC<{toggleModal: (value: SecurityTypeMastersListModalProps) => void, toggleDrawer: (value: SecurityTypeMastersListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:securityTypeMasters, isFetching, isLoading, status, error, refetch} = useSecurityTypeMastersQuery();
  const allChecked = (securityTypeMasters ? securityTypeMasters.securityTypeMaster : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (securityTypeMasters ? securityTypeMasters.securityTypeMaster : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={securityTypeMasters ? securityTypeMasters.securityTypeMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={securityTypeMasters?.total} current_page={securityTypeMasters?.current_page} last_page={securityTypeMasters?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (securityTypeMasters ? securityTypeMasters.securityTypeMaster.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>ID</Table.Th>
              <Table.Th style={{color: 'white'}}>Intrument Type</Table.Th>
              <Table.Th style={{color: 'white'}}>Name Of Company</Table.Th>
              <Table.Th style={{color: 'white'}}>Symbol</Table.Th>
              <Table.Th style={{color: 'white'}}>Series</Table.Th>
              <Table.Th style={{color: 'white'}}>Market Lot</Table.Th>
              <Table.Th style={{color: 'white'}}>Date Of Listing</Table.Th>
              <Table.Th style={{color: 'white'}}>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (securityTypeMasters ? securityTypeMasters.securityTypeMaster : []).map((item) => <SecurityTypeMastersTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default SecurityTypeMastersTable