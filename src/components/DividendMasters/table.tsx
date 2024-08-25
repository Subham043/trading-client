import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { DividendMasterType } from "../../utils/types";
import dayjs from 'dayjs';
import { DividendMastersListDrawerProps, DividendMastersListModalProps } from "../../pages/dividendMasters/list";
import { useDeleteDividendMasterMutation, useDividendMastersQuery } from "../../hooks/data/dividend_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";


const DividendMastersTableRow:FC<DividendMasterType & {toggleModal: (value: DividendMastersListModalProps) => void, toggleDrawer: (value: DividendMastersListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, companyID, recorded_date, financial_year, dividend_per_share, createdAt, toggleDrawer, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteDividendMasters = useDeleteDividendMasterMutation(id, companyID||0)
  const onDelete = async () => {
    await deleteDividendMasters.mutateAsync(undefined)
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
              {recorded_date}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {financial_year}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dividend_per_share}
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteDividendMasters.isPending} disabled={deleteDividendMasters.isPending}>
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

const DividendMastersTable:FC<{toggleModal: (value: DividendMastersListModalProps) => void, toggleDrawer: (value: DividendMastersListDrawerProps) => void, companyId: number, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:dividendMasters, isFetching, isLoading, status, error, refetch} = useDividendMastersQuery({companyId: props.companyId});
  const allChecked = (dividendMasters ? dividendMasters.dividendMaster : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (dividendMasters ? dividendMasters.dividendMaster : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={dividendMasters ? dividendMasters.dividendMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={false} total={dividendMasters?.total} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (dividendMasters ? dividendMasters.dividendMaster.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Recorded Date</Table.Th>
              <Table.Th style={{color: 'white'}}>Financial Year</Table.Th>
              <Table.Th style={{color: 'white'}}>Dividend Per Share</Table.Th>
              <Table.Th style={{color: 'white'}}>Created At</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (dividendMasters ? dividendMasters.dividendMaster : []).map((item) => <DividendMastersTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default DividendMastersTable