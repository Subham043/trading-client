import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { CorporateMasterType } from "../../utils/types";
import dayjs from 'dayjs';
import { CorporateMastersListDrawerProps, CorporateMastersListModalProps } from "../../pages/corporateMasters/list";
import { useDeleteCorporateMasterMutation, useCorporateMastersQuery } from "../../hooks/data/corporate_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";


const CorporateMastersTableRow:FC<CorporateMasterType & {toggleModal: (value: CorporateMastersListModalProps) => void, toggleDrawer: (value: CorporateMastersListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, companyID, date, type, numerator, denominator, createdAt, toggleDrawer, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteCorporateMasters = useDeleteCorporateMasterMutation(id, companyID||0)
  const onDelete = async () => {
    await deleteCorporateMasters.mutateAsync(undefined)
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
              {dayjs(date?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {type}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {numerator}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {denominator}
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteCorporateMasters.isPending} disabled={deleteCorporateMasters.isPending}>
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

const CorporateMastersTable:FC<{toggleModal: (value: CorporateMastersListModalProps) => void, toggleDrawer: (value: CorporateMastersListDrawerProps) => void, companyId: number, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:corporateMasters, isFetching, isLoading, status, error, refetch} = useCorporateMastersQuery({companyId: props.companyId});
  const allChecked = (corporateMasters ? corporateMasters.corporateMaster : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (corporateMasters ? corporateMasters.corporateMaster : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={corporateMasters ? corporateMasters.corporateMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} total={corporateMasters?.total} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (corporateMasters ? corporateMasters.corporateMaster.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>ID</Table.Th>
              <Table.Th style={{color: 'white'}}>Date</Table.Th>
              <Table.Th style={{color: 'white'}}>Type</Table.Th>
              <Table.Th style={{color: 'white'}}>Numerator</Table.Th>
              <Table.Th style={{color: 'white'}}>Denominator</Table.Th>
              <Table.Th style={{color: 'white'}}>Created At</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (corporateMasters ? corporateMasters.corporateMaster : []).map((item) => <CorporateMastersTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default CorporateMastersTable