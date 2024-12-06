import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Anchor, Checkbox, Tooltip } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { CompanyMasterQueryType } from "../../utils/types";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import { CompanyMastersModalProps } from "../../pages/companyMasters/list";
import { useDeleteCompanyMasterMutation, useCompanyMastersQuery } from "../../hooks/data/company_masters";
import { page_routes } from "../../utils/page_routes";
import ErrorBoundary from "../Layout/ErrorBoundary";


const CompanyMasterTableRow:FC<CompanyMasterQueryType & {toggleModal: (value: CompanyMastersModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, currentNameChangeMasters, ISIN, CIN, faceValue, createdAt, toggleModal, selectedData, setSelectedData}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteCompanyMaster = useDeleteCompanyMasterMutation(id)
  
  const onDelete = async () => {
    await deleteCompanyMaster.mutateAsync(undefined)
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
          <Link to={`${page_routes.companyMasters.list}/${id}`}>
            <Anchor component="button" size="sm">
            {id}
            </Anchor>
          </Link>
      </Table.Td>
      <Table.Td>
          <Link to={`${page_routes.companyMasters.list}/${id}`}>
            <Anchor component="button" size="sm">
            {ISIN}
            </Anchor>
          </Link>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {currentNameChangeMasters?.currentName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {CIN}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {currentNameChangeMasters?.BSE}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {currentNameChangeMasters?.NSE}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {faceValue}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <Tooltip label="View">
              <Link to={`${page_routes.companyMasters.list}/${id}/name-change-masters`}>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteCompanyMaster.isPending} disabled={deleteCompanyMaster.isPending}>
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

const CompanyMasterTable:FC<{toggleModal: (value: CompanyMastersModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:companyMasters, isFetching, isLoading, status, error, refetch} = useCompanyMastersQuery();
  const allChecked = (companyMasters ? companyMasters.companyMaster : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (companyMasters ? companyMasters.companyMaster : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;

  return (
    <>
      <ErrorBoundary hasData={companyMasters ? companyMasters.companyMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={companyMasters?.total} current_page={companyMasters?.current_page} last_page={companyMasters?.last_page} refetch={refetch}>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
            <Table.Thead bg="blue">
              <Table.Tr>
                <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (companyMasters ? companyMasters.companyMaster.map((value) => value.id) : []))}
                  />
                </Table.Th>
                <Table.Th style={{color: 'white'}}>ID</Table.Th>
                <Table.Th style={{color: 'white'}}>ISIN</Table.Th>
                <Table.Th style={{color: 'white'}}>Current Name</Table.Th>
                <Table.Th style={{color: 'white'}}>CIN</Table.Th>
                <Table.Th style={{color: 'white'}}>BSE</Table.Th>
                <Table.Th style={{color: 'white'}}>NSE</Table.Th>
                <Table.Th style={{color: 'white'}}>Face Value</Table.Th>
                <Table.Th style={{color: 'white'}}>Created On</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{
              (companyMasters ? companyMasters.companyMaster : []).map((item) => <CompanyMasterTableRow key={item.id} {...item} toggleModal={props.toggleModal} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
            }</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ErrorBoundary>
    </>
  );
}

export default CompanyMasterTable