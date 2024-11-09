import { FC, useState } from "react"
import { Table, Checkbox, Text, Group, ActionIcon, rem, Popover } from '@mantine/core';
import ErrorBoundary from "../Layout/ErrorBoundary";
import { CasesListDrawerProps, CasesListModalProps } from "../../pages/cases/list";
import { useDeleteCaseMutation, useCasesQuery } from "../../hooks/data/cases";
import { CaseType, FolioType, ShareHolderDetailType } from "../../utils/types";
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";

const CasesTableRow:FC<(CaseType & { order: ShareHolderDetailType[], clamaints: ShareHolderDetailType[], foliosSet: FolioType[] }) & {toggleModal: (value: CasesListModalProps) => void, toggleDrawer: (value: CasesListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, shareCertificateID, foliosSet, caseType, createdAt, selectedData, setSelectedData, toggleModal, toggleDrawer}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteCases = useDeleteCaseMutation(id, shareCertificateID?.toString() ?? '');
  const onDelete = async () => {
    await deleteCases.mutateAsync(undefined)
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
              {caseType}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {foliosSet.map((folio) => folio.Folio).join(', ')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon variant="subtle" color="gray" onClick={() => toggleDrawer({drawerStatus: true, id: id})}>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteCases.isPending} disabled={deleteCases.isPending}>
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

const CasesTable:FC<{shareCertificateId: number, toggleModal: (value: CasesListModalProps) => void, toggleDrawer: (value: CasesListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:shareHolderMasters, isFetching, isLoading, status, error, refetch} = useCasesQuery(props.shareCertificateId);
  const allChecked = (shareHolderMasters ? shareHolderMasters.shareHolderMaster : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (shareHolderMasters ? shareHolderMasters.shareHolderMaster : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={shareHolderMasters ? shareHolderMasters.shareHolderMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={shareHolderMasters?.total} current_page={shareHolderMasters?.current_page} last_page={shareHolderMasters?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (shareHolderMasters ? shareHolderMasters.shareHolderMaster.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Case Type</Table.Th>
              <Table.Th style={{color: 'white'}}>Folios</Table.Th>
              <Table.Th style={{color: 'white'}}>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (shareHolderMasters ? shareHolderMasters.shareHolderMaster : []).map((item) => <CasesTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default CasesTable