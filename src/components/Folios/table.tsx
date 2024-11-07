import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover, Checkbox } from '@mantine/core';
import { IconCertificate, IconCheck, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { FolioType } from "../../utils/types";
import { FoliosCorporateMasterModalProps, FoliosDividendMasterModalProps, FoliosListDrawerProps, FoliosListModalProps } from "../../pages/folios/list";
import { useDeleteFolioMutation, useFoliosQuery } from "../../hooks/data/folios";
import ErrorBoundary from "../Layout/ErrorBoundary";


const FoliosTableRow:FC<FolioType & {consolidatedHolding:string; totalMarketValue:number; toggleModal: (value: FoliosListModalProps) => void, toggleCorporateModal: (value: FoliosCorporateMasterModalProps) => void, toggleDividendModal: (value: FoliosDividendMasterModalProps) => void, toggleDrawer: (value: FoliosListDrawerProps) => void, selectedData: number[], setSelectedData: (value: number[]) => void}> = ({id, equityType, faceValue, noOfShares, shareholderName1, shareholderName2, shareholderName3, consolidatedHolding, totalMarketValue, shareCertificateID, toggleCorporateModal, toggleDividendModal, toggleDrawer, selectedData, setSelectedData, toggleModal}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deleteFolios = useDeleteFolioMutation(id, shareCertificateID||0)
  const onDelete = async () => {
    await deleteFolios.mutateAsync(undefined)
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
              {[shareholderName1?.shareholderName, shareholderName2?.shareholderName, shareholderName3?.shareholderName].filter((value) => value).join(', ')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {equityType}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {faceValue}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {noOfShares}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {consolidatedHolding}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {totalMarketValue}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon  variant="subtle" color="gray" onClick={() => toggleDrawer({drawerStatus: true, id: id})}>
                <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" onClick={() => toggleCorporateModal({status: true, id: id})}>
                <IconCertificate style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" onClick={() => toggleDividendModal({status: true, id: id})}>
                <IconCertificate style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deleteFolios.isPending} disabled={deleteFolios.isPending}>
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

const FoliosTable:FC<{toggleModal: (value: FoliosListModalProps) => void, toggleCorporateModal: (value: FoliosCorporateMasterModalProps) => void, toggleDividendModal: (value: FoliosDividendMasterModalProps) => void, toggleDrawer: (value: FoliosListDrawerProps) => void, shareCertificateMasterId: number, selectedData: number[], setSelectedData: (value: number[]) => void}> = (props) => {
  const {data:folios, isFetching, isLoading, status, error, refetch} = useFoliosQuery({shareCertificateMasterId: props.shareCertificateMasterId});
  const allChecked = (folios ? folios.folio : []).every((value) => props.selectedData.includes(value.id));
  const indeterminate = (folios ? folios.folio : []).some((value) => props.selectedData.includes(value.id)) && !allChecked;
  return (
    <ErrorBoundary hasData={folios ? folios.folio.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={folios?.total} current_page={folios?.current_page} last_page={folios?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>
                  <Checkbox
                    color="gray"
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={() => props.setSelectedData(allChecked ? [] : (folios ? folios.folio.map((value) => value.id) : []))}
                  />
                </Table.Th>
              <Table.Th style={{color: 'white'}}>Name of Shareholder(s)</Table.Th>
              <Table.Th style={{color: 'white'}}>Equity Type</Table.Th>
              <Table.Th style={{color: 'white'}}>Face Value</Table.Th>
              <Table.Th style={{color: 'white'}}>No. Of Shares</Table.Th>
              <Table.Th style={{color: 'white'}}>Consolidated Holdings</Table.Th>
              <Table.Th style={{color: 'white'}}>Total Market Share</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (folios ? folios.folio : []).map((item) => <FoliosTableRow key={item.id} {...item} toggleModal={props.toggleModal} toggleCorporateModal={props.toggleCorporateModal} toggleDividendModal={props.toggleDividendModal} toggleDrawer={props.toggleDrawer} selectedData={props.selectedData} setSelectedData={props.setSelectedData} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default FoliosTable