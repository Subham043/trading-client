import { FC, useState } from "react"
import { Table, Group, Text, ActionIcon, rem, Popover } from '@mantine/core';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { PincodeQueryType } from "../../utils/types";
import { PincodesDrawerProps } from "../../pages/pincodes";
import { useDeletePincodeMutation, usePincodesQuery } from "../../hooks/data/pincodes";
import ErrorBoundary from "../Layout/ErrorBoundary";

const PincodeTableRow:FC<PincodeQueryType & {toggleDrawer: (value: PincodesDrawerProps) => void}> = ({id, state_name, circle_name, region_name, division_name, office_name, pincode, office_type, district, toggleDrawer}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const deletePincode = useDeletePincodeMutation(id);
  const onDelete = async () => await deletePincode.mutateAsync();
  return (
    <Table.Tr>
      <Table.Td>
          <Group gap="sm">
          <Text fz="sm" fw={500}>
              {state_name}
          </Text>
          </Group>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
            {circle_name}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
            {region_name}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
            {division_name}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
            {office_name}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
            {pincode}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
            {office_type}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
            {district}
          </Text>
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
                    <ActionIcon variant="subtle" color="red" onClick={onDelete} loading={deletePincode.isPending} disabled={deletePincode.isPending}>
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

const PincodeTable:FC<{toggleDrawer: (value: PincodesDrawerProps) => void}> = (props) => {
  const {data:pincodes, isFetching, isLoading, status, error, refetch} = usePincodesQuery();
  
  return (
    <>
      <ErrorBoundary hasData={pincodes ? pincodes.pincode.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} total={pincodes?.total} current_page={pincodes?.current_page} last_page={pincodes?.last_page} refetch={refetch}>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
            <Table.Thead bg="blue">
              <Table.Tr>
                <Table.Th style={{color: 'white'}}>State Name</Table.Th>
                <Table.Th style={{color: 'white'}}>Circle Name</Table.Th>
                <Table.Th style={{color: 'white'}}>Region Name</Table.Th>
                <Table.Th style={{color: 'white'}}>Division Name</Table.Th>
                <Table.Th style={{color: 'white'}}>Office Name</Table.Th>
                <Table.Th style={{color: 'white'}}>Pincode</Table.Th>
                <Table.Th style={{color: 'white'}}>Office Type</Table.Th>
                <Table.Th style={{color: 'white'}}>District</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{
              (pincodes ? pincodes.pincode : []).map((item) => <PincodeTableRow key={item.id} {...item} toggleDrawer={props.toggleDrawer} />)
            }</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ErrorBoundary>
    </>
  );
}

export default PincodeTable