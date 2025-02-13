import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox, Tooltip } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { LegalHeirDetailType } from "../../utils/types";
import { LegalHeirDetailsListDrawerProps, LegalHeirDetailsListModalProps } from "../../pages/legalHeirDetails/list";
import { useDeleteLegalHeirDetailMutation, useLegalHeirDetailsQuery } from "../../hooks/data/legal_heir_details";
import ErrorBoundary from "../Layout/ErrorBoundary";


const LegalHeirDetailsTableRow:FC<LegalHeirDetailType & {toggleModal: (value: LegalHeirDetailsListModalProps) => void, toggleDrawer: (value: LegalHeirDetailsListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, namePan, phone, email, aadhar, pan, projectID, selectedData, setSelectedData, toggleModal, toggleDrawer}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteLegalHeirDetails = useDeleteLegalHeirDetailMutation(id, projectID||0)
  const onDelete = async () => {
    await deleteLegalHeirDetails.mutateAsync(undefined)
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
              {namePan}
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
            <Tooltip label="View">
              <ActionIcon  variant="subtle" color="gray" onClick={() => toggleDrawer({drawerStatus: true, id: id})}>
                  <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteLegalHeirDetails.isPending} disabled={deleteLegalHeirDetails.isPending}>
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

const LegalHeirDetailsTable:FC<{toggleModal: (value: LegalHeirDetailsListModalProps) => void, toggleDrawer: (value: LegalHeirDetailsListDrawerProps) => void, projectId: number, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:legalHeirDetails, isFetching, isLoading, status, error, refetch} = useLegalHeirDetailsQuery({projectId: props.projectId});
  const allChecked = (legalHeirDetails ? legalHeirDetails.legalHeirDetail : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (legalHeirDetails ? legalHeirDetails.legalHeirDetail : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={legalHeirDetails ? legalHeirDetails.legalHeirDetail.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={legalHeirDetails?.total} current_page={legalHeirDetails?.current_page} last_page={legalHeirDetails?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (legalHeirDetails ? legalHeirDetails.legalHeirDetail.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Name as per pan</Table.Th>
              <Table.Th style={{color: 'white'}}>Phone</Table.Th>
              <Table.Th style={{color: 'white'}}>Email</Table.Th>
              <Table.Th style={{color: 'white'}}>Aadhar</Table.Th>
              <Table.Th style={{color: 'white'}}>Pan</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (legalHeirDetails ? legalHeirDetails.legalHeirDetail : []).map((item) => <LegalHeirDetailsTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default LegalHeirDetailsTable