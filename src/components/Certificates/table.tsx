import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox, Tooltip } from '@mantine/core';
import { IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { CertificateType } from "../../utils/types";
import { CertificatesListDrawerProps, CertificatesListModalProps } from "../../pages/certificates/list";
import { useDeleteCertificateMutation, useCertificatesQuery } from "../../hooks/data/certificates";
import ErrorBoundary from "../Layout/ErrorBoundary";


const CertificatesTableRow:FC<CertificateType & {toggleModal: (value: CertificatesListModalProps) => void, toggleDrawer: (value: CertificatesListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, certificateNumber, certificateSerialNumber, folioID, toggleDrawer, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteCertificates = useDeleteCertificateMutation(id, folioID||0)
  const onDelete = async () => {
    await deleteCertificates.mutateAsync(undefined)
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
              {certificateNumber}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {certificateSerialNumber}
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteCertificates.isPending} disabled={deleteCertificates.isPending}>
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

const CertificatesTable:FC<{toggleModal: (value: CertificatesListModalProps) => void, toggleDrawer: (value: CertificatesListDrawerProps) => void, folioId: number, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:certificates, isFetching, isLoading, status, error, refetch} = useCertificatesQuery({folioId: props.folioId});
  const allChecked = (certificates ? certificates.certificate : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (certificates ? certificates.certificate : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={certificates ? certificates.certificate.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={certificates?.total} current_page={certificates?.current_page} last_page={certificates?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (certificates ? certificates.certificate.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Certificate Number</Table.Th>
              <Table.Th style={{color: 'white'}}>Certificate Serial Number</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (certificates ? certificates.certificate : []).map((item) => <CertificatesTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default CertificatesTable