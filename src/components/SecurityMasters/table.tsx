import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { SecurityMasterType } from "../../utils/types";
import dayjs from 'dayjs';
import { SecurityMastersListDrawerProps, SecurityMastersListModalProps } from "../../pages/securityMasters/list";
import { useDeleteSecurityMasterMutation, useSecurityMastersQuery } from "../../hooks/data/security_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";


const SecurityMastersTableRow:FC<SecurityMasterType & {toggleModal: (value: SecurityMastersListModalProps) => void, toggleDrawer: (value: SecurityMastersListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, instrumentType, companyMaster, equityType, faceValue, noOfShares, shareholderName1, shareholderName2, shareholderName3, createdAt, toggleDrawer, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteSecurityMasters = useDeleteSecurityMasterMutation(id)
  const onDelete = async () => {
    await deleteSecurityMasters.mutateAsync(undefined)
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
              {companyMaster?.currentNameChangeMasters?.currentName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {instrumentType}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {equityType}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {[shareholderName1, shareholderName2, shareholderName3].filter((value) => value).join(', ')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {faceValue}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {noOfShares}
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteSecurityMasters.isPending} disabled={deleteSecurityMasters.isPending}>
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

const SecurityMastersTable:FC<{toggleModal: (value: SecurityMastersListModalProps) => void, toggleDrawer: (value: SecurityMastersListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:securityMasters, isFetching, isLoading, status, error, refetch} = useSecurityMastersQuery();
  const allChecked = (securityMasters ? securityMasters.securityMaster : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (securityMasters ? securityMasters.securityMaster : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={securityMasters ? securityMasters.securityMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={securityMasters?.total} current_page={securityMasters?.current_page} last_page={securityMasters?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (securityMasters ? securityMasters.securityMaster.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Name Of Company</Table.Th>
              <Table.Th style={{color: 'white'}}>Intrument Type</Table.Th>
              <Table.Th style={{color: 'white'}}>Equity Type</Table.Th>
              <Table.Th style={{color: 'white'}}>Name of Shareholder(s)</Table.Th>
              <Table.Th style={{color: 'white'}}>Face Value</Table.Th>
              <Table.Th style={{color: 'white'}}>No. Of Shares</Table.Th>
              <Table.Th style={{color: 'white'}}>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (securityMasters ? securityMasters.securityMaster : []).map((item) => <SecurityMastersTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default SecurityMastersTable