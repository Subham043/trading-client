import { FC, useState } from "react"
import { Table, Checkbox, Text, Group, ActionIcon, rem, Popover } from '@mantine/core';
import ErrorBoundary from "../Layout/ErrorBoundary";
import { ShareHolderMastersListModalProps } from "../../pages/shareHolderMasters/list";
import { useDeleteShareHolderMasterMutation, useShareHolderMastersQuery } from "../../hooks/data/share_holder_masters";
import { ShareHolderMasterType } from "../../utils/types";
import { Link } from "react-router-dom";
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import { page_routes } from "../../utils/page_routes";
import dayjs from "dayjs";

const ShareHolderMastersTableRow:FC<ShareHolderMasterType & {toggleModal: (value: ShareHolderMastersListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, projectID, caseType, noOfLegalHeir, noOfShareHolder, createdAt, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteShareHolderMasters = useDeleteShareHolderMasterMutation(id, projectID?.toString() ?? '');
  const onDelete = async () => {
    await deleteShareHolderMasters.mutateAsync(undefined)
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
              {noOfShareHolder}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {noOfLegalHeir}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <Link to={`${page_routes.shareHolderMasters.list}/${id}`}>
              <ActionIcon  variant="subtle" color="gray">
                  <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Link>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteShareHolderMasters.isPending} disabled={deleteShareHolderMasters.isPending}>
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

const ShareHolderMastersTable:FC<{projectId: string, toggleModal: (value: ShareHolderMastersListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:shareHolderMasters, isFetching, isLoading, status, error, refetch} = useShareHolderMastersQuery(props.projectId);
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
              <Table.Th style={{color: 'white'}}>No. Of Share Holders</Table.Th>
              <Table.Th style={{color: 'white'}}>No. Of Legal Heirs</Table.Th>
              <Table.Th style={{color: 'white'}}>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (shareHolderMasters ? shareHolderMasters.shareHolderMaster : []).map((item) => <ShareHolderMastersTableRow key={item.id} {...item} toggleModal={props.toggleModal} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default ShareHolderMastersTable