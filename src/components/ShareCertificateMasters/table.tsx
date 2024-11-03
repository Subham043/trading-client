import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { ShareCertificateMasterType } from "../../utils/types";
import dayjs from 'dayjs';
import { ShareCertificateMastersListModalProps } from "../../pages/shareCertificateMasters/list";
import { useDeleteShareCertificateMasterMutation, useShareCertificateMastersQuery } from "../../hooks/data/share_certificate_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";
import { Link } from "react-router-dom";
import { page_routes } from "../../utils/page_routes";


const ShareCertificateMastersTableRow:FC<ShareCertificateMasterType & {totalFolioCount: number; totalShares: number; folios:string[]; totalValuationInNse: number; totalValuationInBse: number; toggleModal: (value: ShareCertificateMastersListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, projectID, instrumentType, totalShares, totalValuationInNse, totalValuationInBse, folios, companyMaster, createdAt, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteShareCertificateMasters = useDeleteShareCertificateMasterMutation(id, projectID?.toString() ?? '');
  const onDelete = async () => {
    await deleteShareCertificateMasters.mutateAsync(undefined)
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
              {folios && folios.length > 0 && folios.map((folio, i) => <span key={i}>{folio}<br /></span>)}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {totalShares}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {totalValuationInNse} / {totalValuationInBse}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {dayjs(createdAt?.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <Link to={`${page_routes.shareCertificateMasters.list}/${id}`}>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteShareCertificateMasters.isPending} disabled={deleteShareCertificateMasters.isPending}>
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

const ShareCertificateMastersTable:FC<{projectId: string, toggleModal: (value: ShareCertificateMastersListModalProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:shareCertificateMasters, isFetching, isLoading, status, error, refetch} = useShareCertificateMastersQuery(props.projectId);
  const allChecked = (shareCertificateMasters ? shareCertificateMasters.shareCertificateMaster : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (shareCertificateMasters ? shareCertificateMasters.shareCertificateMaster : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={shareCertificateMasters ? shareCertificateMasters.shareCertificateMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={shareCertificateMasters?.total} current_page={shareCertificateMasters?.current_page} last_page={shareCertificateMasters?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (shareCertificateMasters ? shareCertificateMasters.shareCertificateMaster.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Name Of Company</Table.Th>
              <Table.Th style={{color: 'white'}}>Intrument Type</Table.Th>
              <Table.Th style={{color: 'white'}}>Folios</Table.Th>
              <Table.Th style={{color: 'white'}}>Consolidated Holdings</Table.Th>
              <Table.Th style={{color: 'white'}}>Total Valuation In NSE / BSE</Table.Th>
              <Table.Th style={{color: 'white'}}>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (shareCertificateMasters ? shareCertificateMasters.shareCertificateMaster : []).map((item) => <ShareCertificateMastersTableRow key={item.id} {...item} toggleModal={props.toggleModal} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default ShareCertificateMastersTable