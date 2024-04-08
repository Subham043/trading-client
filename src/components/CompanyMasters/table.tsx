import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { CompanyMasterType } from "../../utils/types";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { CompanyMastersModalProps } from "../../pages/companyMasters/list";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useToast } from "../../hooks/useToast";
import { AxiosError } from "axios";
import { useDeleteCompanyMaster, useCompanyMasters } from "../../hooks/data/company_masters";
import { page_routes } from "../../utils/page_routes";
import ErrorBoundary from "../Layout/ErrorBoundary";


const CompanyMasterTableRow:FC<CompanyMasterType & {toggleModal: (value: CompanyMastersModalProps) => void}> = ({id, newName, BSE, NSE, ISIN, CIN, faceValue, createdAt, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const deleteCompanyMaster = useDeleteCompanyMaster(id)
  const {toastError, toastSuccess} = useToast();
  const onDelete = () => {
    setLoading(true);
    deleteCompanyMaster.mutateAsync(undefined,{
      onSuccess: () => toastSuccess("Company Master deleted successfully."),
      onError: (error:Error) => {
          if(error instanceof AxiosError){
              if(error?.response?.data?.message){
                  toastError(error.response.data.message);
              }
          }else{
              toastError('Something went wrong. Please try again later.');
          }
      },
      onSettled: () => setLoading(false)
    })
  }
  return (
    <Table.Tr>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {newName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {ISIN}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {CIN}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {BSE}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {NSE}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {faceValue}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <Link to={`${page_routes.companyMasters.list}/${id}`}>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={loading}>
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

const CompanyMasterTable:FC<{toggleModal: (value: CompanyMastersModalProps) => void}> = (props) => {
  const [searchParams] = useSearchParams();
  const {data:companyMasters, isFetching, isLoading, status, error, refetch} = useCompanyMasters({page: searchParams.get('page') || QueryInitialPageParam.toString(), limit: searchParams.get('limit') || QueryTotalCount.toString(), search: searchParams.get('search') || ''});
  return (
    <ErrorBoundary hasData={companyMasters ? companyMasters.companyMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} current_page={companyMasters?.current_page} last_page={companyMasters?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>ISIN</Table.Th>
              <Table.Th>CIN</Table.Th>
              <Table.Th>BSE</Table.Th>
              <Table.Th>NSE</Table.Th>
              <Table.Th>Face Value</Table.Th>
              <Table.Th>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (companyMasters ? companyMasters.companyMaster : []).map((item) => <CompanyMasterTableRow key={item.id} {...item} toggleModal={props.toggleModal} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default CompanyMasterTable