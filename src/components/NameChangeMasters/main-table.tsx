import { FC } from "react"
import { Table, Group, Text, ActionIcon, rem, Anchor } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { NameChangeMasterType } from "../../utils/types";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import { page_routes } from "../../utils/page_routes";
import { useNameChangeMastersMainQuery } from "../../hooks/data/name_change_masters";
import ErrorBoundary from "../Layout/ErrorBoundary";


const NameChangeMasterMainTableRow:FC<NameChangeMasterType & {
    CIN?: string | null | undefined;
    ISIN?: string | null | undefined;
    faceValue?: number | null | undefined;
  }> = ({ISIN, CIN, faceValue, currentName, previousName, BSE, NSE, companyId, createdAt}) => {
  
  return (
    <Table.Tr>
      <Table.Td>
          <Link to={`${page_routes.companyMasters.list}/${companyId}`}>
            <Anchor component="button" size="sm">
            {ISIN}
            </Anchor>
          </Link>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {currentName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {previousName}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {CIN}
          </Text>
      </Table.Td>
      <Table.Td>
          <Text fz="sm" fw={500}>
              {faceValue}
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
              {dayjs(createdAt.toString()).locale(Intl.DateTimeFormat().resolvedOptions().locale).format('DD MMM YYYY hh:mm a')}
          </Text>
      </Table.Td>
      <Table.Td>
          <Group gap={0} justify="flex-end">
            <Link to={`${page_routes.companyMasters.list}/${companyId}`}>
              <ActionIcon  variant="subtle" color="gray">
                  <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Link>
          </Group>
      </Table.Td>
    </Table.Tr>
  )
}

const NameChangeMasterMainTable:FC = () => {
  const {data:nameChangeMasters, isFetching, isLoading, status, error, refetch} = useNameChangeMastersMainQuery();
  return (
    <ErrorBoundary hasData={nameChangeMasters ? nameChangeMasters.nameChangeMaster.length>0 : false} isLoading={isLoading || isFetching} status={status} error={error} hasPagination={true} current_page={nameChangeMasters?.current_page} last_page={nameChangeMasters?.last_page} refetch={refetch}>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
          <Table.Thead bg="blue">
            <Table.Tr>
              <Table.Th style={{color: 'white'}}>ISIN</Table.Th>
              <Table.Th style={{color: 'white'}}>New Name</Table.Th>
              <Table.Th style={{color: 'white'}}>Previous Name</Table.Th>
              <Table.Th style={{color: 'white'}}>CIN</Table.Th>
              <Table.Th style={{color: 'white'}}>Face Value</Table.Th>
              <Table.Th style={{color: 'white'}}>BSE</Table.Th>
              <Table.Th style={{color: 'white'}}>NSE</Table.Th>
              <Table.Th style={{color: 'white'}}>Created On</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{
            (nameChangeMasters ? nameChangeMasters.nameChangeMaster : []).map((item) => <NameChangeMasterMainTableRow key={item.id} {...item} />)
          }</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ErrorBoundary>
  );
}

export default NameChangeMasterMainTable