import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { StageNameQueryType } from "../../utils/types";
import { StageNamesDrawerProps } from "../../pages/stageNames";
import { useDeleteStageNameMutation, useStageNamesQuery } from "../../hooks/data/stage_names";
import ErrorBoundary from "../Layout/ErrorBoundary";

const StageNameTableRow:FC<StageNameQueryType & {toggleDrawer: (value: StageNamesDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, name, toggleDrawer, selectedData, setSelectedData}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteStageName = useDeleteStageNameMutation(id);
  const onDelete = async () => await deleteStageName.mutateAsync();
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
          <Group gap="sm">
          <Text fz="sm" fw={500}>
              {id}
          </Text>
          </Group>
      </Table.Td>
      <Table.Td>
          <Group gap="sm">
          <Text fz="sm" fw={500}>
              {name}
          </Text>
          </Group>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteStageName.isPending} disabled={deleteStageName.isPending}>
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

const StageNameTable:FC<{toggleDrawer: (value: StageNamesDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:stageNames, isFetching, isLoading, status, error, refetch} = useStageNamesQuery();
  const allChecked = (stageNames ? stageNames.stageName : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (stageNames ? stageNames.stageName : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <>
      <ErrorBoundary hasData={stageNames ? stageNames.stageName.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={stageNames?.total} current_page={stageNames?.current_page} last_page={stageNames?.last_page} refetch={refetch}>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
            <Table.Thead bg="blue">
              <Table.Tr>
                <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (stageNames ? stageNames.stageName.map((value) => value.id) : []))}
                  />
                </Table.Th>
                <Table.Th style={{color: 'white'}}>ID</Table.Th>
                <Table.Th style={{color: 'white'}}>Name</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{
              (stageNames ? stageNames.stageName : []).map((item) => <StageNameTableRow key={item.id} {...item} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
            }</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ErrorBoundary>
    </>
  );
}

export default StageNameTable