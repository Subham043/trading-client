import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { ShareHolderDetailType } from "../../utils/types";
import { ShareHolderDetailsListDrawerProps, ShareHolderDetailsListModalProps } from "../../pages/shareHolderDetails/list";
import { useDeleteShareHolderDetailMutation, useShareHolderDetailsQuery } from "../../hooks/data/share_holder_details";
import ErrorBoundary from "../Layout/ErrorBoundary";


const ShareHolderDetailsTableRow:FC<ShareHolderDetailType & {toggleModal: (value: ShareHolderDetailsListModalProps) => void, toggleDrawer: (value: ShareHolderDetailsListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, shareholderName, phone, email, aadhar, pan, shareHolderMasterID, selectedData, setSelectedData, toggleModal, toggleDrawer}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteShareHolderDetails = useDeleteShareHolderDetailMutation(id, shareHolderMasterID||0)
  const onDelete = async () => {
    await deleteShareHolderDetails.mutateAsync(undefined)
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
              {shareholderName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {phone}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {email}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {aadhar}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {pan}
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteShareHolderDetails.isPending} disabled={deleteShareHolderDetails.isPending}>
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

const ShareHolderDetailsTable:FC<{toggleModal: (value: ShareHolderDetailsListModalProps) => void, toggleDrawer: (value: ShareHolderDetailsListDrawerProps) => void, shareHolderMasterId: number, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:shareHolderDetails, isFetching, isLoading, status, error, refetch} = useShareHolderDetailsQuery({shareHolderMasterId: props.shareHolderMasterId});
  const allChecked = (shareHolderDetails ? shareHolderDetails.shareHolderDetail : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (shareHolderDetails ? shareHolderDetails.shareHolderDetail : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={shareHolderDetails ? shareHolderDetails.shareHolderDetail.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={shareHolderDetails?.total} current_page={shareHolderDetails?.current_page} last_page={shareHolderDetails?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (shareHolderDetails ? shareHolderDetails.shareHolderDetail.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Name of Shareholder</Table.Th>
              <Table.Th style={{color: 'white'}}>Phone</Table.Th>
              <Table.Th style={{color: 'white'}}>Email</Table.Th>
              <Table.Th style={{color: 'white'}}>Aadhar</Table.Th>
              <Table.Th style={{color: 'white'}}>Pan</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (shareHolderDetails ? shareHolderDetails.shareHolderDetail : []).map((item) => <ShareHolderDetailsTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default ShareHolderDetailsTable